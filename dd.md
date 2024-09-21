# QuerySage-AI Data Dictionary

## 1. User
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| UserID | Integer | Unique identifier for each user |
| Username | String | User's login name |
| Password | String (hashed) | User's encrypted password |
| Email | String | User's email address |
| Role | Enum (User, Admin) | User's role in the system |
| CreatedAt | DateTime | Timestamp of account creation |
| LastLogin | DateTime | Timestamp of last login |

## 2. Query
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| QueryID | Integer | Unique identifier for each query |
| UserID | Integer | Foreign key to User table |
| NaturalLanguageQuery | Text | The original query in natural language |
| TranslatedQuery | Text | The query translated to SQL or analysis instructions |
| QueryType | Enum (Database, CSV, JSON) | Type of data source for the query |
| CreatedAt | DateTime | Timestamp of query creation |
| LastExecuted | DateTime | Timestamp of last execution |

## 3. DataSource
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| SourceID | Integer | Unique identifier for each data source |
| SourceName | String | Name of the data source |
| SourceType | Enum (MySQL, PostgreSQL, MongoDB, SQLite, CSV, JSON) | Type of the data source |
| ConnectionString | String | Connection details (for databases) |
| FilePath | String | File path (for CSV/JSON files) |
| CreatedAt | DateTime | Timestamp of data source creation |
| LastConnected | DateTime | Timestamp of last successful connection |

## 4. QueryResult
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| ResultID | Integer | Unique identifier for each query result |
| QueryID | Integer | Foreign key to Query table |
| ResultData | JSON | Query results in JSON format |
| ExecutionTime | Float | Time taken to execute the query (in seconds) |
| RowsAffected | Integer | Number of rows affected or returned |
| CreatedAt | DateTime | Timestamp of result creation |

## 5. QueryHistory
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| HistoryID | Integer | Unique identifier for each history entry |
| UserID | Integer | Foreign key to User table |
| QueryID | Integer | Foreign key to Query table |
| Action | Enum (Execute, Preview, Edit) | Type of action performed |
| Timestamp | DateTime | Timestamp of the action |

## 6. SystemSettings
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| SettingID | Integer | Unique identifier for each setting |
| SettingName | String | Name of the setting |
| SettingValue | String | Value of the setting |
| Description | Text | Description of the setting's purpose |
| LastModified | DateTime | Timestamp of last modification |

## 7. ErrorLog
| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| LogID | Integer | Unique identifier for each log entry |
| UserID | Integer | Foreign key to User table (if applicable) |
| ErrorMessage | Text | Description of the error |
| StackTrace | Text | Technical details of the error |
| Severity | Enum (Low, Medium, High, Critical) | Severity level of the error |
| Timestamp | DateTime | Timestamp of when the error occurred |
