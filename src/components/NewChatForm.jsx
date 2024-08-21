"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label'

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
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">New Chat</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="chatName">Chat Name</Label>
            <Input
              id="chatName"
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Enter a chat name"
              required
            />
          </div>
          <div>
            <Label htmlFor="dbType">Database Type</Label>
            <Select id="dbType" value={dbType} onValueChange={setDbType}>
              <SelectTrigger>
                <SelectValue placeholder="Select database type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mongodb">MongoDB</SelectItem>
                <SelectItem value="mysql">MySQL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {dbType === 'mysql' && (
            <>
              <div>
                <Label htmlFor="mysqlHost">Host</Label>
                <Input
                  id="mysqlHost"
                  type="text"
                  value={dbInfo.host}
                  onChange={(e) => setDbInfo({ ...dbInfo, host: e.target.value })}
                  placeholder="Enter MySQL host"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mysqlUser">User</Label>
                <Input
                  id="mysqlUser"
                  type="text"
                  value={dbInfo.user}
                  onChange={(e) => setDbInfo({ ...dbInfo, user: e.target.value })}
                  placeholder="Enter MySQL user"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mysqlPassword">Password</Label>
                <Input
                  id="mysqlPassword"
                  type="password"
                  value={dbInfo.password}
                  onChange={(e) => setDbInfo({ ...dbInfo, password: e.target.value })}
                  placeholder="Enter MySQL password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mysqlDatabase">Database</Label>
                <Input
                  id="mysqlDatabase"
                  type="text"
                  value={dbInfo.database}
                  onChange={(e) => setDbInfo({ ...dbInfo, database: e.target.value })}
                  placeholder="Enter MySQL database"
                  required
                />
              </div>
            </>
          )}
          {dbType === 'mongodb' && (
            <div>
              <Label htmlFor="mongodbUri">MongoDB URI</Label>
              <Input
                id="mongodbUri"
                type="text"
                value={dbInfo.uri}
                onChange={(e) => setDbInfo({ ...dbInfo, uri: e.target.value })}
                placeholder="Enter MongoDB URI"
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
          variant="outline"
          type="submit"
          disabled={testingConnection}
          onClick={handleSubmit}
        >
          {testingConnection ? 'Testing connection...' : 'Connect'}
        </Button>
      </CardFooter>
    </Card>
  );
}