"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, XCircle } from 'lucide-react';

export default function NewChatForm({ onSubmit, onCancel }) {
  const [chatName, setChatName] = useState('');
  const [dbType, setDbType] = useState('');
  const [error, setError] = useState('');
  const [dbInfo, setDbInfo] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    uri: '',
    port: '',
    filename: '',
    connectionString: '', // Added for Neon DB
  });
  const [testingConnection, setTestingConnection] = useState(false);

  const validateForm = () => {
    if (!chatName.trim()) {
      setError('Please enter a chat name');
      return false;
    }
    if (!dbType) {
      setError('Please select a database type');
      return false;
    }

    switch (dbType) {
      case 'mongodb':
        if (!dbInfo.uri) {
          setError('Please enter MongoDB URI');
          return false;
        }
        break;
      case 'neondb':
        if (!dbInfo.connectionString) {
          setError('Please enter Neon DB connection string');
          return false;
        }
        break;
      case 'mysql':
      case 'postgresql':
        if (!dbInfo.host || !dbInfo.user || !dbInfo.password || !dbInfo.database) {
          setError(`Please fill in all ${dbType.toUpperCase()} connection fields`);
          return false;
        }
        break;
      case 'sqlite':
        if (!dbInfo.host) {
          setError('Please enter SQLite database path');
          return false;
        }
        break;
      default:
        setError('Invalid database type selected');
        return false;
    }
    return true;
  };

  const formatDbInfo = () => {
    const formattedInfo = { ...dbInfo };
    
    if (dbType === 'sqlite') {
      // For SQLite, copy the host (path) to filename as expected by the Dashboard
      formattedInfo.filename = dbInfo.host;
    }
    
    // Ensure port is a number for MySQL and PostgreSQL
    if ((dbType === 'mysql' || dbType === 'postgresql') && dbInfo.port) {
      formattedInfo.port = parseInt(dbInfo.port, 10);
    }

    return formattedInfo;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setTestingConnection(true);

    try {
      // Format the database info according to the type
      const formattedDbInfo = formatDbInfo();

      // Submit the formatted data
      onSubmit({
        chatName,
        dbType,
        dbInfo: formattedDbInfo
      });
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 border border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          New Chat
        </h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="chatName">Chat Name</Label>
            <Input
              id="chatName"
              value={chatName}
              onChange={(e) => {
                setChatName(e.target.value);
                setError('');
              }}
              placeholder="Enter a chat name"
              className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dbType">Database Type</Label>
            <Select 
              value={dbType} 
              onValueChange={(value) => {
                setDbType(value);
                setError('');
                setDbInfo({
                  host: '',
                  user: '',
                  password: '',
                  database: '',
                  uri: '',
                  port: '',
                  filename: '',
                  connectionString: '',
                });
              }}
            >
              <SelectTrigger className="w-full transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30">
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="postgresql">PostgreSQL</SelectItem>
                <SelectItem value="sqlite">SQLite</SelectItem>
                <SelectItem value="neondb">Neon DB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dbType === 'mongodb' && (
            <div className="space-y-2">
              <Label htmlFor="uri">MongoDB URI</Label>
              <Input
                id="uri"
                type="text"
                value={dbInfo.uri}
                onChange={(e) => {
                  setDbInfo({ ...dbInfo, uri: e.target.value });
                  setError('');
                }}
                placeholder="mongodb://username:password@host:port/database"
                className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
              />
            </div>
          )}

          {(dbType === 'mysql' || dbType === 'postgresql') && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="host">Host</Label>
                  <Input
                    id="host"
                    type="text"
                    value={dbInfo.host}
                    onChange={(e) => {
                      setDbInfo({ ...dbInfo, host: e.target.value });
                      setError('');
                    }}
                    placeholder="localhost"
                    className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="text"
                    value={dbInfo.port}
                    onChange={(e) => {
                      setDbInfo({ ...dbInfo, port: e.target.value });
                      setError('');
                    }}
                    placeholder={dbType === 'mysql' ? '3306' : '5432'}
                    className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="database">Database Name</Label>
                <Input
                  id="database"
                  type="text"
                  value={dbInfo.database}
                  onChange={(e) => {
                    setDbInfo({ ...dbInfo, database: e.target.value });
                    setError('');
                  }}
                  placeholder="database_name"
                  className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user">Username</Label>
                <Input
                  id="user"
                  type="text"
                  value={dbInfo.user}
                  onChange={(e) => {
                    setDbInfo({ ...dbInfo, user: e.target.value });
                    setError('');
                  }}
                  placeholder="username"
                  className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={dbInfo.password}
                  onChange={(e) => {
                    setDbInfo({ ...dbInfo, password: e.target.value });
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
                />
              </div>
            </div>
          )}

          {dbType === 'sqlite' && (
            <div className="space-y-2">
              <Label htmlFor="path">Database Path</Label>
              <Input
                id="path"
                type="text"
                value={dbInfo.host}
                onChange={(e) => {
                  setDbInfo({ ...dbInfo, host: e.target.value, filename: e.target.value });
                  setError('');
                }}
                placeholder="/path/to/database.db"
                className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
              />
            </div>
          )}

          {dbType === 'neondb' && (
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="connectionString">Connection String</Label>
                <Input
                  type="text"
                  id="connectionString"
                  value={dbInfo.connectionString}
                  onChange={(e) => setDbInfo({ ...dbInfo, connectionString: e.target.value })}
                  placeholder="postgres://user:password@host/database"
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="hover:bg-blue-500/10"
        >
          Cancel
        </Button>
        <Button
          variant="default"
          onClick={handleSubmit}
          disabled={testingConnection}
          className="w-32 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
        >
          {testingConnection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Create Chat'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}