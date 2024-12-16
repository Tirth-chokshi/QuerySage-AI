import mysql from 'mysql2/promise';
import { Client as PostgresClient } from 'pg';
import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

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
}

interface TestDBConnectionRequest {
  host: string;
  user: string;
  password: string;
  database: string;
  dbType: string;
  uri?: string;
}

async function testDBConnection(request: NextRequest) {
    try {
      const { host, user, password, database, dbType, uri }: TestDBConnectionRequest = await request.json();
  
      try {
          let connection;
  
          switch (dbType) {
              case 'mysql':
                  connection = await mysql.createConnection({
                      host,
                      user,
                      password,
                      database,
                  });
                  await connection.end();
                  break;
  
              case 'postgresql':
              case 'neon':
                  let connectionConfig;
                  if (uri) {
                      connectionConfig = {
                          connectionString: uri,
                          ssl: {
                              rejectUnauthorized: false
                          }
                      };
                  } else {
                      connectionConfig = {
                          host,
                          user,
                          password,
                          database,
                          ssl: dbType === 'neon' ? {
                              rejectUnauthorized: false
                          } : undefined
                      };
                  }
                  const pgClient = new PostgresClient(connectionConfig);
                  await pgClient.connect();
                  await pgClient.end();
                  break;
  
              case 'mongodb':
                  const mongoClient = new MongoClient(`mongodb://${user}:${password}@${host}/${database}`);
                  await mongoClient.connect();
                  await mongoClient.close();
                  break;
  
              case 'sqlite':
                  // SQLite doesn't require a connection test in the same way, as it connects to a file.
                  // We can simply check if the database file exists if needed.
                  break;
  
              default:
                  return NextResponse.json({ success: false, message: 'Unsupported database type' });
          }
  
          return NextResponse.json({ success: true });
      } catch (error: unknown) {
          console.error('Connection error:', error);
          return NextResponse.json({ success: false, message: error instanceof Error ? error.message : String(error) });
      }
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

// Export the POST handler directly
export async function POST(request: NextRequest) {
  return testDBConnection(request);
}