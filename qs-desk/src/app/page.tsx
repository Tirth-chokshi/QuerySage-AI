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

interface Message {
  role: "user" | "assistant";
  content: string;
}

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

  const handleCredentialChange = (
    field: keyof DBCredentials,
    value: string
  ): void => {
    setDbCredentials((prev) => ({ ...prev, [field]: value }));
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

  const testConnection = async (): Promise<void> => {
    const response = await fetch("/api/testConn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...dbCredentials,
        port: dbCredentials.port ? parseInt(dbCredentials.port) : undefined,
      }),
    });
    const data = await response.json();
    setIsConnected(data.success);
  };

  const sendMessage = async (): Promise<void> => {
    if (!inputMessage.trim() || !dbType) return;

    setIsLoading(true);
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: inputMessage },
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
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Unknown error occurred");
      }

      const data: { response: string } = await response.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "An error occurred while processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      (
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Database Configuration</h2>
          <div className="grid gap-4">
            <div>
              <Select
                onValueChange={(value: DBType) => setDbType(value)}
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
                onChange={(e) =>
                  handleCredentialChange("filename", e.target.value)
                }
              />
            )}

            {(dbType === "mysql" || dbType === "postgresql") && (
              <>
                <Input
                  placeholder="Host"
                  value={dbCredentials.host}
                  onChange={(e) =>
                    handleCredentialChange("host", e.target.value)
                  }
                />
                <Input
                  placeholder="Port"
                  value={dbCredentials.port}
                  onChange={(e) =>
                    handleCredentialChange("port", e.target.value)
                  }
                  type="number"
                />
                <Input
                  placeholder="Database"
                  value={dbCredentials.database}
                  onChange={(e) =>
                    handleCredentialChange("database", e.target.value)
                  }
                />
                <Input
                  placeholder="Username"
                  value={dbCredentials.user}
                  onChange={(e) =>
                    handleCredentialChange("user", e.target.value)
                  }
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={dbCredentials.password}
                  onChange={(e) =>
                    handleCredentialChange("password", e.target.value)
                  }
                />
              </>
            )}
          </div>
          <Button onClick={testConnection}>Test Connection</Button>
        </Card>
      </div>
      <div className="container mx-auto p-4 max-w-4xl">
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
                {message.content}
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
      </div>
      )
    </div>
  );
}
