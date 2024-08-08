"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewChatForm({ onSubmit, onCancel }) {
  const [chatName, setChatName] = useState('');
  const [dbType, setDbType] = useState('');
  const [dbInfo, setDbInfo] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    uri: '',
    filename: '',
    type: ''
  });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileData = null;
    
    if (dbType === 'files' && file) {
      fileData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            content: e.target.result
          });
        };
        reader.readAsText(file);
      });
    }

    onSubmit({ chatName, dbType, dbInfo, file: fileData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
        placeholder="Chat Name"
        required
      />
      <div className="mb-4">
        <Select value={dbType} onValueChange={setDbType}>
          <SelectTrigger>
            <SelectValue placeholder="Select database type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mongodb">MongoDB</SelectItem>
            <SelectItem value="mysql">MySQL</SelectItem>
            <SelectItem value="sqlite">SQLite</SelectItem>
            <SelectItem value="files">Files</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {dbType === 'mysql' && (
        <>
          <Input
            type="text"
            value={dbInfo.host}
            onChange={(e) => setDbInfo({ ...dbInfo, host: e.target.value })}
            placeholder="Host"
            required
          />
          <Input
            type="text"
            value={dbInfo.user}
            onChange={(e) => setDbInfo({ ...dbInfo, user: e.target.value })}
            placeholder="User"
            required
          />
          <Input
            type="password"
            value={dbInfo.password}
            onChange={(e) => setDbInfo({ ...dbInfo, password: e.target.value })}
            placeholder="Password"
            required
          />
          <Input
            type="text"
            value={dbInfo.database}
            onChange={(e) => setDbInfo({ ...dbInfo, database: e.target.value })}
            placeholder="Database"
            required
          />
          <Input
            type="text"
            value={dbInfo.type}
            onChange={(e) => setDbInfo({ ...dbInfo, type: e.target.value })}
            placeholder="Database Type"
            required
          />
        </>
      )}
      {dbType === 'mongodb' && (
        <>
          <Input
            type="text"
            value={dbInfo.uri}
            onChange={(e) => setDbInfo({ ...dbInfo, uri: e.target.value })}
            placeholder="MongoDB URI"
            required
          />
          <Input
            type="text"
            value={dbInfo.type}
            onChange={(e) => setDbInfo({ ...dbInfo, type: e.target.value })}
            placeholder="Database Type"
            required
          />
        </>
      )}
      {dbType === 'sqlite' && (
        <>
          <Input
            type="text"
            value={dbInfo.filename}
            onChange={(e) => setDbInfo({ ...dbInfo, filename: e.target.value })}
            placeholder="SQLite File Path"
            required
          />
          <Input
            type="text"
            value={dbInfo.type}
            onChange={(e) => setDbInfo({ ...dbInfo, type: e.target.value })}
            placeholder="Database Type"
            required
          />
        </>
      )}
      {dbType === 'files' && (
        <Input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      )}
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Chat</Button>
      </div>
    </form>
  );
}