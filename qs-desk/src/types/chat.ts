export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  dbType: string;
  dbCredentials: {
    host?: string;
    user?: string;
    password?: string;
    database?: string;
    port?: number;
    uri?: string;
    filename?: string;
  };
}
