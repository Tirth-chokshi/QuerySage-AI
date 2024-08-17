"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function MainChatInterface({
  messages,
  input,
  setInput,
  handleSubmit,
  isLoading,
  handleCreateChat,
  showNewChatForm,
  setShowNewChatForm,
}) {
  const [dbType, setDbType] = useState('');
  const [dbCredentials, setDbCredentials] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    uri: '',
    filename: '',
  });
  const [chatName, setChatName] = useState('');
  const [file, setFile] = useState(null);

  const handleNewChatSubmit = (e) => {
    e.preventDefault();
    handleCreateChat({ chatName, dbType, dbInfo: dbCredentials, file });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </div>
      </form>

      <Dialog open={showNewChatForm} onOpenChange={setShowNewChatForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chat</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNewChatSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chatName" className="text-right">
                  Chat Name
                </Label>
                <Input
                  id="chatName"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dbType" className="text-right">
                  Database Type
                </Label>
                <Select onValueChange={setDbType} value={dbType}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                    <SelectItem value="files">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {dbType === 'mysql' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="host" className="text-right">
                      Host
                    </Label>
                    <Input
                      id="host"
                      value={dbCredentials.host}
                      onChange={(e) => setDbCredentials({ ...dbCredentials, host: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="user" className="text-right">
                      User
                    </Label>
                    <Input
                      id="user"
                      value={dbCredentials.user}
                      onChange={(e) => setDbCredentials({ ...dbCredentials, user: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={dbCredentials.password}
                      onChange={(e) => setDbCredentials({ ...dbCredentials, password: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="database" className="text-right">
                      Database
                    </Label>
                    <Input
                      id="database"
                      value={dbCredentials.database}
                      onChange={(e) => setDbCredentials({ ...dbCredentials, database: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
              {dbType === 'mongodb' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="uri" className="text-right">
                    MongoDB URI
                  </Label>
                  <Input
                    id="uri"
                    value={dbCredentials.uri}
                    onChange={(e) => setDbCredentials({ ...dbCredentials, uri: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              )}
              {dbType === 'sqlite' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="filename" className="text-right">
                    SQLite Filename
                  </Label>
                  <Input
                    id="filename"
                    value={dbCredentials.filename}
                    onChange={(e) => setDbCredentials({ ...dbCredentials, filename: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              )}
              {dbType === 'files' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    CSV File
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="col-span-3"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Create Chat</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}