import { Groq } from 'groq-sdk';
import mysql from 'mysql2/promise';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Client as PostgresClient } from 'pg';
import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { Message, ChatSession } from '@/types/chat';
import {
  generateMySQLDatabaseChunks,
  generateMongoDBChunks,
  generateSQLiteChunks,
  generatePostgreSQLChunks
} from '@/lib/actions';

interface DBCredentials {
  host?: string;
  user?: string;
  password?: string;
  database?: string;
  port?: number;
  uri?: string;
  filename?: string;
}

interface RequestBody {
  query: string;
  dbCredentials: DBCredentials;
  dbType: string;
  chatId: string;
  messages: Message[];
}

interface TestDBConnectionRequest {
  host: string;
  user: string;
  password: string;
  database: string;
  dbType: string;
}

export async function POST(request: NextRequest) {
  try {
    const LLM_API = process.env.LLM_API;
    if (!LLM_API) {
      return NextResponse.json({ error: 'LLM_API is not defined' }, { status: 500 });
    }

    const body: RequestBody = await request.json();
    const { query, dbCredentials, dbType, messages } = body;
    const groq = new Groq({ apiKey: LLM_API });

    let chunkGenerator: AsyncGenerator<string>;

    switch (dbType.toLowerCase()) {
      case 'mysql': {
        const mysqlConnection = await mysql.createConnection({
          host: dbCredentials.host,
          user: dbCredentials.user,
          password: dbCredentials.password,
          database: dbCredentials.database,
        });
        chunkGenerator = generateMySQLDatabaseChunks(mysqlConnection);
        break;
      }
      case 'mongodb': {
        if (!dbCredentials.uri) {
          throw new Error('MongoDB URI is required');
        }
        const client = new MongoClient(dbCredentials.uri);
        await client.connect();
        const db = client.db();
        chunkGenerator = generateMongoDBChunks(db);
        break;
      }
      case 'sqlite': {
        if (!dbCredentials.filename) {
          throw new Error('SQLite filename is required');
        }
        const sqliteConnection = await open({
          filename: dbCredentials.filename,
          driver: sqlite3.Database
        });
        chunkGenerator = generateSQLiteChunks(sqliteConnection);
        break;
      }
      case 'postgresql': {
        const pgClient = new PostgresClient({
          host: dbCredentials.host,
          user: dbCredentials.user,
          password: dbCredentials.password,
          database: dbCredentials.database,
          port: dbCredentials.port || 5432,
        });
        await pgClient.connect();
        chunkGenerator = generatePostgreSQLChunks(pgClient);
        break;
      }
      default:
        return NextResponse.json(
          { error: `Unsupported database type: ${dbType}` },
          { status: 400 }
        );
    }

    let fullResponse = '';

    for await (const chunk of chunkGenerator) {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Your name is QuerySage-AI. You are an AI assistant that answers questions based on the following data:\n\n${chunk}\n\nIf you need more information to answer the question, say "I need more information."`,
          },
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { role: 'user', content: query },
        ],
        model: 'llama-3.3-70b-versatile',
      });

      const chunkResponse = completion.choices[0]?.message?.content;
      if (chunkResponse) {
        fullResponse += chunkResponse + ' ';

        if (!chunkResponse.includes('I need more information')) {
          break;
        }
      }
    }
    return NextResponse.json({ 
      response: fullResponse.trim(),
      messages: [
        ...messages,
        { role: 'user', content: query, timestamp: new Date().toISOString() },
        { role: 'assistant', content: fullResponse.trim(), timestamp: new Date().toISOString() }
      ]
    });

  } catch (error: unknown) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while processing your request.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
