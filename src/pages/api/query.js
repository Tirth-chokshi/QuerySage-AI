import { Groq } from 'groq-sdk'
import { MongoClient } from 'mongodb'
import mysql from 'mysql2/promise'
import dbConnect from '@/lib/dbConnect'
import Message from '@/models/Message'
import { generateMongoDBChunks } from '@/lib/action'
import { generateMySQLDatabaseChunks } from '@/lib/action'


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query, dbCredentials, dbType, chatId } = req.body
    const groq = new Groq({ apiKey: process.env.LLM_API })

    try {
      await dbConnect()
      let fullResponse = ''

      if (dbType === 'mysql') {
        const connection = await mysql.createConnection({
          host: dbCredentials.host,
          user: dbCredentials.user,
          password: dbCredentials.password,
          database: dbCredentials.database,
        })

        const chunkGenerator = generateMySQLDatabaseChunks(connection)

        for await (const chunk of chunkGenerator) {
          const completion = await groq.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are an AI assistant that answers questions based on the following MySQL database structure:\n\n${chunk}\n\nIf you need more information about other tables to answer the question, say "I need more information."`
              },
              { role: 'user', content: query },
            ],
            model: 'llama3-8b-8192',
            max_tokens: 1024,
          })

          const chunkResponse = completion.choices[0]?.message?.content
          fullResponse += chunkResponse + ' '

          if (!chunkResponse.includes('I need more information')) {
            break
          }
        }

        await connection.end()
      } else if (dbType === 'mongodb') {
        const client = new MongoClient(dbCredentials.uri)
        await client.connect()
        const db = client.db()

        const chunkGenerator = generateMongoDBChunks(db)

        for await (const chunk of chunkGenerator) {
          const completion = await groq.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are an AI assistant that answers questions based on the following MongoDB database structure:\n\n${chunk}\n\nIf you need more information about other collections to answer the question, say "I need more information."`
              },
              { role: 'user', content: query },
            ],
            model: 'llama3-8b-8192',
            max_tokens: 1024,
          })

          const chunkResponse = completion.choices[0]?.message?.content
          fullResponse += chunkResponse + ' '

          if (!chunkResponse.includes('I need more information')) {
            break
          }
        }

        await client.close()
      } else {
        throw new Error(`Unsupported database type: ${dbType}`)
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
