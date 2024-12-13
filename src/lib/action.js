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

export async function getPostgreSQLSchema(client) {
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

export async function* generatePostgreSQLChunks(client) {
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

export async function getSQLiteSchema(connection) {
    let tables
    try {
        tables = await connection.all("SELECT name FROM sqlite_master WHERE type='table'")
    } catch {
        tables = await new Promise((resolve, reject) => {
            connection.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    let schema = ''

    for (const table of tables) {
        const tableName = table.name || table['name']
        const columnInfo = await connection.all(`PRAGMA table_info(${tableName})`)
        const columns = columnInfo.map(col => `${col.name} (${col.type})`)
        schema += `Table: ${tableName}\nColumns: ${columns.join(', ')}\n\n`
    }

    return schema
}

export async function* generateSQLiteChunks(connection) {
    const schema = await getSQLiteSchema(connection)
    let currentChunk = ''

    const lines = schema.split('\n')
    for (const line of lines) {
        if ((currentChunk + line + '\n').length * TOKENS_PER_CHAR > MAX_TOKENS) {
            yield currentChunk
            currentChunk = ''
        }
        currentChunk += line + '\n'
    }

    if (currentChunk) {
        yield currentChunk
    }
}
