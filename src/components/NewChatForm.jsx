"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react';

export default function NewChatForm({ onSubmit, onCancel }) {
  const [chatName, setChatName] = useState('');
  const [dbType, setDbType] = useState('')
  const [dbInfo, setDbInfo] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    uri: '',
    type: ''
  });

  const [testingConnection, setTestingConnection] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTestingConnection(true);

    try {
      const response = await fetch('/api/testConnection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dbType, dbInfo }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        onSubmit({ chatName, dbType, dbInfo });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      alert(`Error testing connection: ${error.message}`);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 border border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">New Chat</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="chatName" className="text-foreground/90">Chat Name</Label>
            <Input
              id="chatName"
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Enter a chat name"
              required
              className="w-full transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dbType" className="text-foreground/90">Database Type</Label>
            <Select id="dbType" value={dbType} onValueChange={setDbType}>
              <SelectTrigger className="w-full transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30">
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm border-border/50">
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="postgreSQL">PostgreSQL</SelectItem>
                <SelectItem value="sqlite">SQLite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {dbType === 'mysql' && (
            <div className="space-y-4">
              <Input
                type="text"
                value={dbInfo.host}
                onChange={(e) => setDbInfo({ ...dbInfo, host: e.target.value })}
                placeholder="MySQL Host"
                required
                className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
              />
              <Input
                type="text"
                value={dbInfo.user}
                onChange={(e) => setDbInfo({ ...dbInfo, user: e.target.value })}
                placeholder="MySQL User"
                required
                className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
              />
              <Input
                type="password"
                value={dbInfo.password}
                onChange={(e) => setDbInfo({ ...dbInfo, password: e.target.value })}
                placeholder="MySQL Password"
                required
                className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
              />
              <Input
                type="text"
                value={dbInfo.database}
                onChange={(e) => setDbInfo({ ...dbInfo, database: e.target.value })}
                placeholder="MySQL Database"
                required
                className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
              />
            </div>
          )}
          {dbType === 'mongodb' && (
            <Input
              type="text"
              value={dbInfo.uri}
              onChange={(e) => setDbInfo({ ...dbInfo, uri: e.target.value })}
              placeholder="MongoDB URI"
              required
              className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
            />
          )}
          {dbType === 'sqlite' && (
            <div className="space-y-4">
              <Input
                type="text"
                value={dbInfo.host}
                onChange={(e) => setDbInfo({ ...dbInfo, host: e.target.value })}
                placeholder="SQLite Database Path"
                required
                className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
              />
            </div>
          )}
          {dbType === 'postgreSQL' && (
            <div className="space-y-4">
              <Input
                type="text"
                value={dbInfo.host}
                onChange={(e) => setDbInfo({ ...dbInfo, host: e.target.value })}
                placeholder="PostgreSQL Host"
                required
                className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
              />
              <Input
                type="text"
                value={dbInfo.user}
                onChange={(e) => setDbInfo({ ...dbInfo, user: e.target.value })}
                placeholder="PostgreSQL User"
                required
                className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
              />
              <Input
                type="password"
                value={dbInfo.password}
                onChange={(e) => setDbInfo({ ...dbInfo, password: e.target.value })}
                placeholder="PostgreSQL Password"
                required
                className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
              />
              <Input
                type="text"
                value={dbInfo.database}
                onChange={(e) => setDbInfo({ ...dbInfo, database: e.target.value })}
                placeholder="PostgreSQL Database"
                required
                className="transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30"
              />
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button 
          variant="ghost" 
          type="button" 
          onClick={onCancel}
          className="hover:bg-blue-500/10"
        >
          Cancel
        </Button>
        <Button
          variant="default"
          type="submit"
          disabled={testingConnection}
          onClick={handleSubmit}
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
