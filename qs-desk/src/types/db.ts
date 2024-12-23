export interface DBCredentials {
    host: string;
    user: string;
    password: string;
    database: string;
    port: string;
    uri: string;
    filename: string;
  }
  
export type DBType = "mysql" | "postgresql" | "mongodb" | "sqlite" | "neon" | "";