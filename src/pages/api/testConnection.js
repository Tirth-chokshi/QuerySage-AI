import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { dbType, host, user, password, database,uri } = req.body;

    if (dbType === 'mysql') {
      if (!host || !user || !password || !database) {
        return res.status(400).json({ error: 'Missing required MySQL credentials' });
      }

      try {
        const connection = await mysql.createConnection({
          host,
          user,
          password,
          database,
        });
        await connection.end();
        res.status(200).json({ message: 'MySQL connection successful' });
      } catch (error) {
        console.error('MySQL connection error:', error);
        res.status(500).json({ error: 'Failed to connect to MySQL database', details: error.message });
      }
    } else if (dbType === 'sqlite') {
      try {
        const dbPath = path.join(process.cwd(), 'tmp', 'database.sqlite');
        const db = await open({
          filename: dbPath,
          driver: sqlite3.Database,
        });
        await db.close();
        res.status(200).json({ message: 'SQLite connection successful' });
      } catch (error) {
        console.error('SQLite connection error:', error);
        res.status(500).json({ error: 'Failed to connect to SQLite database', details: error.message });
      }
    } else if (dbType === 'mongodb') {
      if (!uri) {
        return res.status(400).json({ error: 'Missing required MongoDB URI' });
      }

      try {
        const client = new MongoClient(uri);
        await client.connect();
        await client.db().command({ ping: 1 });
        await client.close();
        res.status(200).json({ message: 'MongoDB connection successful' });
      } catch (error) {
        console.error('MongoDB connection error:', error);
        res.status(500).json({ error: 'Failed to connect to MongoDB', details: error.message });
      }
    } else {
      res.status(400).json({ error: 'Invalid database type' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}