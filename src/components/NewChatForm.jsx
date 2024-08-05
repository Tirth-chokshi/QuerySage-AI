"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ chatName, dbType, dbInfo });
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
      <select value={dbType} onChange={(e) => setDbType(e.target.value)} className="w-full p-2 border rounded">
        <option value="select">select Type of Database</option>
        <option value="mongodb">MongoDB</option>
        <option value="mysql">MySQL</option>
      </select>
      {dbType === 'mysql' ? (
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
      ) : (
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
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Chat</Button>
      </div>
    </form>
  );
}
