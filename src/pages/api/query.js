import { Groq } from 'groq-sdk';
import { MongoClient } from 'mongodb';
import mysql from 'mysql2/promise';

const MAX_TOKENS = 8000;
const TOKENS_PER_CHAR = 0.25;

async function getMySQLDatabaseSchema(connection) {
  const [tables] = await connection.query('SHOW TABLES');
  let schema = '';

  for (const table of tables) {
    const tableName = Object.values(table)[0];
    const [columns] = await connection.query(`DESCRIBE ${tableName}`);
    schema += `Table: ${tableName}\nColumns: ${columns.map(col => `${col.Field} (${col.Type})`).join(', ')}\n\n`;
  }

  return schema;
}

async function* generateMySQLDatabaseChunks(connection) {
  const schema = await getMySQLDatabaseSchema(connection);
  let currentChunk = '';

  const lines = schema.split('\n');
  for (const line of lines) {
    if ((currentChunk + line + '\n').length * TOKENS_PER_CHAR > MAX_TOKENS) {
      yield currentChunk;
      currentChunk = '';
    }
    currentChunk += line + '\n';
  }

  if (currentChunk) {
    yield currentChunk;
  }
}

async function getMongoDBCollectionSchema(collection) {
  const sampleDoc = await collection.findOne();
  return Object.keys(sampleDoc || {}).join(', ');
}

async function* generateMongoDBChunks(db) {
  const collections = await db.listCollections().toArray();
  let currentChunk = '';

  for (const collection of collections) {
    const collectionName = collection.name;
    const schema = await getMongoDBCollectionSchema(db.collection(collectionName));
    const collectionInfo = `Collection: ${collectionName}\nSchema: ${schema}\n\n`;

    if ((currentChunk + collectionInfo).length * TOKENS_PER_CHAR > MAX_TOKENS) {
      yield currentChunk;
      currentChunk = '';
    }
    currentChunk += collectionInfo;
  }

  if (currentChunk) {
    yield currentChunk;
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { query, dbCredentials, dbType } = req.body;
    const groq = new Groq({ apiKey: process.env.LLM_API });

    try {
      let fullResponse = '';

      if (dbType === 'mysql') {
        const connection = await mysql.createConnection({
          host: dbCredentials.host,
          user: dbCredentials.user,
          password: dbCredentials.password,
          database: dbCredentials.database,
        });

        const chunkGenerator = generateMySQLDatabaseChunks(connection);

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
          });

          const chunkResponse = completion.choices[0]?.message?.content;
          fullResponse += chunkResponse + ' ';

          if (!chunkResponse.includes('I need more information')) {
            break;
          }
        }

        await connection.end();
      } else if (dbType === 'mongodb') {
        const client = new MongoClient(dbCredentials.uri);
        await client.connect();
        const db = client.db();

        const chunkGenerator = generateMongoDBChunks(db);

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
          });

          const chunkResponse = completion.choices[0]?.message?.content;
          fullResponse += chunkResponse + ' ';

          if (!chunkResponse.includes('I need more information')) {
            break;
          }
        }

        await client.close();
      } else {
        throw new Error(`Unsupported database type: ${dbType}`);
      }

      res.status(200).json({ response: fullResponse.trim() });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}