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
    type: ''
  });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileData = null;
    onSubmit({ chatName, dbType, dbInfo });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Input
        type="text"
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
        placeholder="Chat Name"
        required
      />
      <Select value={dbType} onValueChange={setDbType}>
        <SelectTrigger>
          <SelectValue placeholder="Select database type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mongodb">MongoDB</SelectItem>
          <SelectItem value="mysql">MySQL</SelectItem>
        </SelectContent>
      </Select>
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
        </>
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
      <div className="flex justify-end space-x-2">
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="outline" type="submit">Create Chat</Button>
      </div>
    </form>
  );
}