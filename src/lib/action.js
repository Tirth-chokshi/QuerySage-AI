
import Chat from "@/models/Chat";
import User from "@/models/User";
import { Groq } from 'groq-sdk';
import { MongoClient } from 'mongodb';
import mysql from 'mysql2/promise';
import dbConnect from '@/lib/dbConnect';
import Message from '@/models/Message';
import fs from 'fs'
import csv from 'csv-parser'

const MAX_TOKENS = 8000;
const TOKENS_PER_CHAR = 0.25;

export async function getMySQLDatabaseSchema(connection) {
    const [tables] = await connection.query('SHOW TABLES');
    let schema = '';

    for (const table of tables) {
        const tableName = Object.values(table)[0];
        const [columns] = await connection.query(`DESCRIBE ${tableName}`);
        schema += `Table: ${tableName}\nColumns: ${columns.map(col => `${col.Field} (${col.Type})`).join(', ')}\n\n`;
    }

    return schema;
}

export async function* generateMySQLDatabaseChunks(connection) {
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
export async function getMongoDBCollectionSchema(collection) {
    const sampleDoc = await collection.findOne();
    return Object.keys(sampleDoc || {}).join(', ');
}

export async function* generateMongoDBChunks(db) {
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
export async function* generateCSVChunks(content) {
    let currentChunk = '';
    let header = '';
  
    const rows = content.split('\n');
    header = rows[0] + '\n';
  
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if ((currentChunk + row + '\n').length * TOKENS_PER_CHAR > MAX_TOKENS) {
        yield header + currentChunk;
        currentChunk = '';
      }
      currentChunk += row + '\n';
    }
  
    if (currentChunk) {
      yield header + currentChunk;
    }
  }

// export async function* generateSQLCSVChunks(connectionOrSchema) {
//     let schema;
//     if (typeof connectionOrSchema === 'string') {
//         schema = connectionOrSchema;
//     } else {
//         schema = await getMySQLDatabaseSchema(connectionOrSchema);
//     }

//     let currentChunk = '';
//     const lines = schema.split('\n');

//     for (const line of lines) {
//         if ((currentChunk + line + '\n').length * TOKENS_PER_CHAR > MAX_TOKENS) {
//             yield currentChunk;
//             currentChunk = '';
//         }
//         currentChunk += line + '\n';
//     }

//     if (currentChunk) {
//         yield currentChunk;
//     }
// }