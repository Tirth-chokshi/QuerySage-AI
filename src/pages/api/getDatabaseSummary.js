import { MongoClient } from 'mongodb'
import mysql from 'mysql2/promise'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { dbType, dbInfo } = req.body

    try {
      let summary = ''

      if (dbType === 'mysql') {
        const connection = await mysql.createConnection({
          host: dbInfo.host,
          user: dbInfo.user,
          password: dbInfo.password,
          database: dbInfo.database,
        })

        // Get table names
        const [tables] = await connection.query('SHOW TABLES')
        summary += `Tables in the database:\n${tables.map(table => Object.values(table)[0]).join(', ')}\n\n`

        // For each table, get column information
        for (const table of tables) {
          const tableName = Object.values(table)[0]
          const [columns] = await connection.query(`DESCRIBE ${tableName}`)
          summary += `Table: ${tableName}\n`
          summary += columns.map(col => `${col.Field} (${col.Type}${col.Key === 'PRI' ? ', Primary Key' : ''}`).join('\n')
          summary += '\n\n'
        }

        await connection.end()
      } else if (dbType === 'mongodb') {
        const client = new MongoClient(dbInfo.uri)
        await client.connect()
        const db = client.db()

        const collections = await db.listCollections().toArray()
        summary += `Collections in the database:\n${collections.map(col => col.name).join(', ')}\n\n`

        for (const collection of collections) {
          const sampleDoc = await db.collection(collection.name).findOne()
          summary += `Collection: ${collection.name}\n`
          summary += `Sample document structure:\n${JSON.stringify(sampleDoc, null, 2)}\n\n`
        }

        await client.close()
      } else if (dbType === 'sqlite') {
        const db = await open({
          filename: dbInfo.filename,
          driver: sqlite3.Database
        })

        const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'")
        summary += `Tables in the database:\n${tables.map(table => table.name).join(', ')}\n\n`

        for (const table of tables) {
          const columns = await db.all(`PRAGMA table_info(${table.name})`)
          summary += `Table: ${table.name}\n`
          summary += columns.map(col => `${col.name} (${col.type}${col.pk ? ', Primary Key' : ''}`).join('\n')
          summary += '\n\n'
        }

        await db.close()
      } else {
        throw new Error(`Unsupported database type: ${dbType}`)
      }

      res.status(200).json({ summary })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'An error occurred while fetching the database summary.', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}