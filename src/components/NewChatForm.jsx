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
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">New Chat</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="chatName">Chat Name</Label>
            <Input
              id="chatName"
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Enter a chat name"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dbType">Database Type</Label>
            <Select id="dbType" value={dbType} onValueChange={setDbType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
                <SelectItem value="mongodb">PostgreSQL</SelectItem>
                <SelectItem value="mysql">Sqlite</SelectItem>
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
              />
              <Input
                type="text"
                value={dbInfo.user}
                onChange={(e) => setDbInfo({ ...dbInfo, user: e.target.value })}
                placeholder="MySQL User"
                required
              />
              <Input
                type="password"
                value={dbInfo.password}
                onChange={(e) => setDbInfo({ ...dbInfo, password: e.target.value })}
                placeholder="MySQL Password"
                required
              />
              <Input
                type="text"
                value={dbInfo.database}
                onChange={(e) => setDbInfo({ ...dbInfo, database: e.target.value })}
                placeholder="MySQL Database"
                required
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
            />
          )}
          {dbType === 'sqlite' && (
            <div className="space-y-4">
              <Input
                type="text"
                value={dbInfo.host}
                onChange={(e) => setDbInfo({ ...dbInfo, host: e.target.value })}
                placeholder="MySQL Host"
                required
              />
              <Input
                type="text"
                value={dbInfo.user}
                onChange={(e) => setDbInfo({ ...dbInfo, user: e.target.value })}
                placeholder="MySQL User"
                required
              />
              <Input
                type="password"
                value={dbInfo.password}
                onChange={(e) => setDbInfo({ ...dbInfo, password: e.target.value })}
                placeholder="MySQL Password"
                required
              />
              <Input
                type="text"
                value={dbInfo.database}
                onChange={(e) => setDbInfo({ ...dbInfo, database: e.target.value })}
                placeholder="MySQL Database"
                required
              />
            </div>
          )}
          {dbType === 'postgreSQL' && (
            <div className="space-y-4">
              <Input
                type="text"
                value={dbInfo.host}
                onChange={(e) => setDbInfo({ ...dbInfo, host: e.target.value })}
                placeholder="MySQL Host"
                required
              />
              <Input
                type="text"
                value={dbInfo.user}
                onChange={(e) => setDbInfo({ ...dbInfo, user: e.target.value })}
                placeholder="MySQL User"
                required
              />
              <Input
                type="password"
                value={dbInfo.password}
                onChange={(e) => setDbInfo({ ...dbInfo, password: e.target.value })}
                placeholder="MySQL Password"
                required
              />
              <Input
                type="text"
                value={dbInfo.database}
                onChange={(e) => setDbInfo({ ...dbInfo, database: e.target.value })}
                placeholder="MySQL Database"
                required
              />
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="default"
          type="submit"
          disabled={testingConnection}
          onClick={handleSubmit}
          className="w-32"
        >
          {testingConnection ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting
            </>
          ) : (
            'Connect'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
