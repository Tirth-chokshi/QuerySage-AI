// Optimized for Llama-3.3-70b-versatile with 128k context window
const MAX_TOKENS = 32000 // Increased to match max output tokens while leaving room for prompt
const TOKENS_PER_CHAR = 0.35 // Adjusted for more accurate token estimation

// Type definitions
type MySQLConnection = {
    query: (sql: string) => Promise<any[]>;
};

type PostgreSQLClient = {
    query: (sql: string) => Promise<{ rows: any[] }>;
};

type MongoDBCollection = {
    findOne: () => Promise<Record<string, any> | null>;
};

type MongoDB = {
    listCollections: () => { toArray: () => Promise<Array<{ name: string }>> };
    collection: (name: string) => MongoDBCollection;
};

type SQLiteConnection = {
    all: (sql: string, callback?: (err: Error | null, rows: any[]) => void) => Promise<any[]>;
};

export async function getMySQLDatabaseSchema(connection: MySQLConnection): Promise<string> {
    const [tables] = await connection.query('SHOW TABLES');
    let schema = '';

    for (const table of tables) {
        const tableName = Object.values(table)[0];
        const [columns] = await connection.query(`DESCRIBE ${tableName}`);
        schema += `Table: ${tableName}\nColumns: ${columns.map((col: { Field: string; Type: string }) => 
            `${col.Field} (${col.Type})`).join(', ')}\n\n`;
    }

    return schema;
}

export async function* generateMySQLDatabaseChunks(connection: MySQLConnection): AsyncGenerator<string> {
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

export async function getPostgreSQLSchema(client: PostgreSQLClient): Promise<string> {
    const schema = await client.query(`
        SELECT 
            table_name,
            string_agg(column_name || ' (' || data_type || ')', ', ') as columns
        FROM information_schema.columns
        WHERE table_schema = 'public'
        GROUP BY table_name;
    `);
    
    let schemaText = '';
    for (const row of schema.rows) {
        schemaText += `Table: ${row.table_name}\nColumns: ${row.columns}\n\n`;
    }
    return schemaText;
}

export async function* generatePostgreSQLChunks(client: PostgreSQLClient): AsyncGenerator<string> {
    const schema = await getPostgreSQLSchema(client);
    let currentChunk = '';

    const lines = schema.split('\n');
    for (const line of lines) {
        if ((currentChunk.length + line.length) * TOKENS_PER_CHAR > MAX_TOKENS) {
            yield currentChunk;
            currentChunk = '';
        }
        currentChunk += line + '\n';
    }
    
    if (currentChunk) {
        yield currentChunk;
    }
}

export async function getMongoDBCollectionSchema(collection: MongoDBCollection): Promise<string> {
    const sampleDoc = await collection.findOne();
    return Object.keys(sampleDoc || {}).join(', ');
}

export async function* generateMongoDBChunks(db: MongoDB): AsyncGenerator<string> {
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

export async function* generateCSVChunks(content: string): AsyncGenerator<string> {
    let currentChunk = '';
    const header = content.split('\n')[0] + '\n';

    const rows = content.split('\n');

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

export async function getSQLiteSchema(connection: SQLiteConnection): Promise<string> {
    let tables: Array<{ name: string }>;
    try {
        tables = await connection.all("SELECT name FROM sqlite_master WHERE type='table'");
    } catch {
        tables = await new Promise((resolve, reject) => {
            connection.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    let schema = '';

    for (const table of tables) {
        const tableName = table.name;
        const columnInfo = await connection.all(`PRAGMA table_info(${tableName})`);
        const columns = columnInfo.map(col => `${col.name} (${col.type})`);
        schema += `Table: ${tableName}\nColumns: ${columns.join(', ')}\n\n`;
    }

    return schema;
}

export async function* generateSQLiteChunks(connection: SQLiteConnection): AsyncGenerator<string> {
    const schema = await getSQLiteSchema(connection);
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
