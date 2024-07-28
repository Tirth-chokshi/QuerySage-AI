import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { host, user, password, database } = req.body;

    if (!host || !user || !password || !database) {
      return res.status(400).json({ error: 'Missing required database credentials' });
    }

    try {
      // Attempt to create a connection
      const connection = await mysql.createConnection({
        host,
        user,
        password,
        database,
      });

      // If connection is successful, close it immediately
      await connection.end();

      // Return success response
      res.status(200).json({ message: 'Database connection successful' });
    } catch (error) {
      console.error('Database connection error:', error);
      res.status(500).json({ error: 'Failed to connect to the database', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}