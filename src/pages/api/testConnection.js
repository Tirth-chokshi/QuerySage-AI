import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';
import { Client as PostgresClient } from 'pg';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { dbType, dbInfo } = req.body;

    if (dbType === 'mysql') {
      if (!dbInfo.host || !dbInfo.user || !dbInfo.password || !dbInfo.database) {
        return res.status(400).json({ error: 'Missing required MySQL credentials' });
      }

      try {
        const connection = await mysql.createConnection({
          host: dbInfo.host,
          user: dbInfo.user,
          password: dbInfo.password,
          database: dbInfo.database,
        });
        await connection.end();
        res.status(200).json({ message: 'MySQL connection successful' });
      } catch (error) {
        console.error('MySQL connection error:', error);
        res.status(500).json({ error: 'Failed to connect to MySQL database', details: error.message });
      }
    } else if (dbType === 'mongodb') {
      if (!dbInfo.uri) {
        return res.status(400).json({ error: 'Missing required MongoDB URI' });
      }
      
      try {
        const client = new MongoClient(dbInfo.uri);
        await client.connect();
        await client.db().command({ ping: 1 });
        await client.close();
        res.status(200).json({ message: 'MongoDB connection successful' });
      } catch (error) {
        console.error('MongoDB connection error:', error);
        res.status(500).json({ error: 'Failed to connect to MongoDB', details: error.message });
      }
    } else if (dbType === 'postgresql') {
      if (!dbInfo.host || !dbInfo.user || !dbInfo.password || !dbInfo.database) {
        return res.status(400).json({ error: 'Missing required PostgreSQL credentials' });
      }

      try {
        const client = new PostgresClient({
          host: dbInfo.host,
          user: dbInfo.user,
          password: dbInfo.password,
          database: dbInfo.database,
          port: dbInfo.port || 5432,
        });
        await client.connect();
        await client.query('SELECT NOW()'); // Simple query to test connection
        await client.end();
        res.status(200).json({ message: 'PostgreSQL connection successful' });
      } catch (error) {
        console.error('PostgreSQL connection error:', error);
        res.status(500).json({ error: 'Failed to connect to PostgreSQL database', details: error.message });
      }
    } else if (dbType === 'neondb') {
      if (!dbInfo.connectionString) {
        return res.status(400).json({ error: 'Missing required Neon DB connection string' });
      }

      try {
        const client = new PostgresClient({
          connectionString: dbInfo.connectionString,
        });
        await client.connect();
        await client.query('SELECT 1');
        await client.end();
        res.status(200).json({ message: 'Neon DB connection successful' });
      } catch (error) {
        console.error('Neon DB connection error:', error);
        res.status(500).json({ error: 'Failed to connect to Neon DB', details: error.message });
      }
    } else {
      res.status(400).json({ error: 'Invalid database type' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}