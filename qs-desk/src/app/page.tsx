"use client";

import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Message } from '@/types/chat';
import ReactMarkdown from 'react-markdown'

interface DBCredentials {
  host: string;
  user: string;
  password: string;
  database: string;
  port: string;
  uri: string;
  filename: string;
}

type DBType = "mysql" | "postgresql" | "mongodb" | "sqlite" | "";

export default function Home(): JSX.Element {
  const { toast } = useToast()
  const [dbType, setDbType] = useState<DBType>("");
  const [dbCredentials, setDbCredentials] = useState<DBCredentials>({
    host: "",
    user: "",
    password: "",
    database: "",
    port: "",
    uri: "",
    filename: "",
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);

  const handleCredentialChange = (
    field: keyof DBCredentials,
    value: string
  ): void => {
    setDbCredentials((prev) => ({ ...prev, [field]: value }));
    setIsConnected(false);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputMessage(e.target.value);
  };

  const handleDBTypeChange = (value: DBType): void => {
    setDbType(value);
    setIsConnected(false);
    setMessages([]);
  };

  const validateCredentials = (): boolean => {
    if (!dbType) {
      toast({
        title: "Validation Error",
        description: "Please select a database type.",
        variant: "destructive",
      });
      return false;
    }

    if (dbType === "mongodb" && !dbCredentials.uri) {
      toast({
        title: "Validation Error",
        description: "Please enter MongoDB URI.",
        variant: "destructive",
      });
      return false;
    }

    if (dbType === "sqlite" && !dbCredentials.filename) {
      toast({
        title: "Validation Error",
        description: "Please enter SQLite filename.",
        variant: "destructive",
      });
      return false;
    }

    if ((dbType === "mysql" || dbType === "postgresql") && 
        (!dbCredentials.host || !dbCredentials.user || 
         !dbCredentials.password || !dbCredentials.database)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDisconnect = (): void => {
    setIsConnected(false);
    setMessages([]);
    setInputMessage("");
  };

  const testConnection = async (): Promise<void> => {
    if (!validateCredentials()) {
      return;
    }

    setIsTestingConnection(true);
    try {
      const response = await fetch("/api/testConn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dbCredentials,
          port: dbCredentials.port ? parseInt(dbCredentials.port) : undefined,
          dbType,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Connection Successful",
          description: "You can now start querying your database.",
          variant: "default",
        });
        setIsConnected(true);
      } else {
        toast({
          title: "Connection Failed",
          description: data.message || "Failed to connect to the database.",
          variant: "destructive",
        });
        setIsConnected(false);
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "An error occurred while testing the connection.",
        variant: "destructive",
      });
      setIsConnected(false);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const sendMessage = async (): Promise<void> => {
    if (!inputMessage.trim() || !isConnected) return;

    setIsLoading(true);
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: inputMessage, timestamp: new Date().toISOString() },
    ];
    setMessages(newMessages);
    setInputMessage("");

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: inputMessage,
          dbCredentials: {
            ...dbCredentials,
            port: dbCredentials.port ? parseInt(dbCredentials.port) : undefined,
          },
          dbType,
          chatId: "default",
          messages: messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Unknown error occurred");
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "An error occurred while processing your request.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {!isConnected ? (
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Database Configuration</h2>
          <div className="grid gap-4">
            <div>
              <Select
                onValueChange={(value: DBType) => handleDBTypeChange(value)}
                value={dbType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Database Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="mongodb">MongoDB</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dbType === "mongodb" && (
              <Input
                placeholder="MongoDB URI"
                value={dbCredentials.uri}
                onChange={(e) => handleCredentialChange("uri", e.target.value)}
              />
            )}

            {dbType === "sqlite" && (
              <Input
                placeholder="SQLite Filename"
                value={dbCredentials.filename}
                onChange={(e) => handleCredentialChange("filename", e.target.value)}
              />
            )}

            {(dbType === "mysql" || dbType === "postgresql") && (
              <>
                <Input
                  placeholder="Host"
                  value={dbCredentials.host}
                  onChange={(e) => handleCredentialChange("host", e.target.value)}
                />
                <Input
                  placeholder="Port"
                  value={dbCredentials.port}
                  onChange={(e) => handleCredentialChange("port", e.target.value)}
                  type="number"
                />
                <Input
                  placeholder="Database"
                  value={dbCredentials.database}
                  onChange={(e) => handleCredentialChange("database", e.target.value)}
                />
                <Input
                  placeholder="Username"
                  value={dbCredentials.user}
                  onChange={(e) => handleCredentialChange("user", e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={dbCredentials.password}
                  onChange={(e) => handleCredentialChange("password", e.target.value)}
                />
              </>
            )}
          </div>
          <div className="mt-4">
            <Button 
              onClick={testConnection} 
              disabled={isTestingConnection}
              className="w-full"
            >
              {isTestingConnection ? "Testing Connection..." : "Test Connection"}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Database Chat</h2>
            <Button
              variant="outline"
              onClick={handleDisconnect}
              size="sm"
            >
              Disconnect
            </Button>
          </div>
          <div className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-100 ml-auto max-w-[80%]"
                      : "bg-gray-100 mr-auto max-w-[80%]"
                  }`}
                >
                  <ReactMarkdown
                  components={{
                    code: ({ node, inline, className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & {
                      node?: any;
                      inline?: boolean;
                      className?: string;
                    }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      if (inline) {
                        return <code className="bg-gray-800 rounded px-1" {...props}>{children}</code>
                      }
                      return (
                        <div className="bg-[#1C1C1C] rounded-lg p-4 my-2">
                          <code className="text-sm font-mono text-white" {...props}>
                            {children}
                          </code>
                        </div>
                      )
                    }
                  }}
                >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="Ask a question about your database..."
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <Button onClick={() => void sendMessage()} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}