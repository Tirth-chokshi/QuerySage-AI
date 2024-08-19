import { Groq } from 'groq-sdk'
import { MongoClient } from 'mongodb'
import mysql from 'mysql2/promise'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import dbConnect from '@/lib/dbConnect'
import Message from '@/models/Message'
import path from 'path'
import { generateCSVChunks } from '@/lib/action'
import { generateMySQLDatabaseChunks } from '@/lib/action'
import { generateMongoDBChunks } from '@/lib/action'
import { generateSQLiteChunks } from '@/lib/action'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query, dbCredentials, dbType, chatId, fileData } = req.body
    const groq = new Groq({ apiKey: process.env.LLM_API })

    try {
      await dbConnect()
      let fullResponse = ''
      let chunkGenerator

      if (dbType === 'mysql') {
        const connection = await mysql.createConnection({
          host: dbCredentials.host,
          user: dbCredentials.user,
          password: dbCredentials.password,
          database: dbCredentials.database,
        })
        chunkGenerator = generateMySQLDatabaseChunks(connection)
      } else if (dbType === 'mongodb') {
        const client = new MongoClient(dbCredentials.uri)
        await client.connect()
        const db = client.db()
        chunkGenerator = generateMongoDBChunks(db)
      } else if (dbType === 'sqlite') {
        const connection = await open({
          filename: dbCredentials.filename,
          driver: sqlite3.Database
        })
        chunkGenerator = generateSQLiteChunks(connection)
      } else if (dbType === 'files') {
        if (!fileData || !fileData.name || !fileData.content) {
          throw new Error('Invalid file data')
        }
        const fileExtension = path.extname(fileData.name).toLowerCase()

        if (fileExtension === '.csv') {
          chunkGenerator = generateCSVChunks(fileData.content)
        } else {
          throw new Error(`Unsupported file type: ${fileExtension}`)
        }
      } else {
        throw new Error(`Unsupported database type: ${dbType}`)
      }

      for await (const chunk of chunkGenerator) {
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant that answers questions based on the following data:\n\n${chunk}\n\nIf you need more information to answer the question, say "I need more information."`,
            },
            { role: 'user', content: query },
          ],
          model: 'llama3-8b-8192',
          max_tokens: 4096,
        })

        const chunkResponse = completion.choices[0]?.message?.content
        fullResponse += chunkResponse + ' '

        if (!chunkResponse.includes('I need more information')) {
          break
        }
      }

      // Save the user's message
      const userMessage = new Message({
        chatId,
        text: query,
        sender: 'user',
      })
      await userMessage.save()

      // Save the bot's response
      const botMessage = new Message({
        chatId,
        text: fullResponse.trim(),
        sender: 'bot',
      })
      await botMessage.save()

      res.status(200).json({ response: fullResponse.trim() })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'An error occurred while processing your request.', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}