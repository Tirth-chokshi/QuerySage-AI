# QuerySage-AI

**Natural Language to SQL & NoSQL Query Translation Engine**

QuerySage-AI is an intelligent database interface that translates conversational natural language queries into syntactically verified, secure SQL and NoSQL execution statements across multiple database engines (PostgreSQL, MySQL, SQLite, MongoDB, CSV, JSON).

---

## Key Capabilities

* **Natural Language to Query (NL2SQL / NL2NoSQL):** Converts plain English questions into optimized database queries using LangChain and Groq LLM inference.
* **Multi-Engine Connector Support:**
  * Relational: **PostgreSQL**, **MySQL**, **SQLite**
  * Document Store: **MongoDB**
  * Static Files: **CSV**, **JSON** uploads with in-memory relational mapping
* **Schema Intelligence:** Automated schema introspection, column type discovery, and foreign-key relationship graphing.
* **Interactive Data Studio:** Visual query builder, syntax-highlighted SQL editor, execution performance telemetry, and tabular/graphical result visualization.
* **Security & Sandboxing:** Read-only query enforcement, SQL injection mitigation, and role-based execution boundaries.

---

## Technical Architecture

```
QuerySage-AI/
├── src/
│   ├── app/                  # Next.js 14 App Router (Pages, API Routes)
│   │   ├── api/              # Query execution, schema introspection & auth endpoints
│   │   ├── dashboard/        # Interactive query workspace and studio
│   │   └── layout.js         # Root layout with NextThemes provider
│   ├── components/           # Radix UI + Tailwind design primitives & chart blocks
│   ├── lib/                  # Database connectors (pg, mysql2, sqlite3, mongoose)
│   └── services/             # LLM prompt orchestration via Groq & LangChain
```

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router), React 18 |
| **Styling & UI** | Tailwind CSS, Radix UI Primitives, Lucide Icons, Framer Motion, Recharts |
| **AI Inference** | Groq SDK (`groq-sdk`, `@ai-sdk/groq`), LangChain, Vercel AI SDK |
| **Database Drivers** | `pg` (PostgreSQL), `mysql2` (MySQL), `sqlite3` (SQLite), `mongoose` (MongoDB) |
| **Authentication** | NextAuth.js with MongoDB Adapter |

---

## Getting Started

### 1. Prerequisites
* Node.js 18+ (Node.js 20 recommended)
* pnpm, npm, or yarn
* Groq Cloud API Key (for LLM inference)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Tirth-chokshi/QuerySage-AI.git
cd QuerySage-AI
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/querysage
```

### 4. Running the Application
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Data Dictionary

### 1. User
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| UserID | Integer | Unique identifier for each user |
| Username | String | User's login name |
| Email | String | User's email address |
| CreatedAt | DateTime | Timestamp of account creation |
| LastLogin | DateTime | Timestamp of last login |

### 2. Query
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| QueryID | Integer | Unique identifier for each query |
| UserID | Integer | Foreign key to User table |
| NaturalLanguageQuery | Text | The original query in natural language |
| TranslatedQuery | Text | The query translated to SQL or analysis instructions |
| QueryType | Enum (Database, CSV, JSON) | Type of data source for the query |
| CreatedAt | DateTime | Timestamp of query creation |
| LastExecuted | DateTime | Timestamp of last execution |

### 3. DataSource
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| SourceID | Integer | Unique identifier for each data source |
| SourceName | String | Name of the data source |
| SourceType | Enum (MySQL, PostgreSQL, MongoDB, SQLite, CSV, JSON) | Type of the data source |
| ConnectionString | String | Connection details (for databases) |
| FilePath | String | File path (for CSV/JSON files) |
| CreatedAt | DateTime | Timestamp of data source creation |
| LastConnected | DateTime | Timestamp of last successful connection |

### 4. QueryResult
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| ResultID | Integer | Unique identifier for each query result |
| QueryID | Integer | Foreign key to Query table |
| ResultData | JSON | Query results in JSON format |
| ExecutionTime | Float | Time taken to execute the query (in seconds) |
| RowsAffected | Integer | Number of rows affected or returned |
| CreatedAt | DateTime | Timestamp of result creation |

### 5. QueryHistory
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| HistoryID | Integer | Unique identifier for each history entry |
| UserID | Integer | Foreign key to User table |
| QueryID | Integer | Foreign key to Query table |
| Action | Enum (Execute, Preview, Edit) | Type of action performed |
| Timestamp | DateTime | Timestamp of the action |

### 6. SystemSettings
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| SettingID | Integer | Unique identifier for each setting |
| SettingName | String | Name of the setting |
| SettingValue | String | Value of the setting |
| Description | Text | Description of the setting's purpose |
| LastModified | DateTime | Timestamp of last modification |

### 7. ErrorLog
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| LogID | Integer | Unique identifier for each log entry |
| UserID | Integer | Foreign key to User table (if applicable) |
| ErrorMessage | Text | Description of the error |
| StackTrace | Text | Technical details of the error |
| Severity | Enum (Low, Medium, High, Critical) | Severity level of the error |
| Timestamp | DateTime | Timestamp of when the error occurred |

---

## License

This project is licensed under the [MIT License](LICENSE).
