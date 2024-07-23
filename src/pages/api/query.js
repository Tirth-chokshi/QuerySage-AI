import { Groq } from 'groq-sdk';
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query } = req.body;
    const groq = new Groq({
      apiKey: process.env.LLM_API,
    });

    try {
      const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "dbconnect",
        database: "atliq_tshirts",
      });

      // Fetch all table names
      const [tables] = await connection.query('SHOW TABLES');
      let databaseStructure = '';

      // Fetch structure and sample data of each table
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        const [columns] = await connection.query(`DESCRIBE ${tableName}`);
        const [sampleData] = await connection.query(`SELECT * FROM ${tableName} LIMIT 5`);
        
        databaseStructure += `Table: ${tableName}\n`;
        databaseStructure += `Columns: ${columns.map(col => col.Field).join(', ')}\n`;
        databaseStructure += `Sample data: ${JSON.stringify(sampleData, null, 2)}\n\n`;
      }

      await connection.end();

      // Use Groq to interpret the natural language query
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that answers questions based on the following database structure:\n\n${databaseStructure}`
          },
          {
            role: 'user',
            content: query,
          }
        ],
        model: 'llama3-70b-8192',
      });

      let response = completion.choices[0]?.message?.content;

      res.status(200).json({ response });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}