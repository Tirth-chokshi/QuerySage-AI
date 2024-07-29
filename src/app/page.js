"use client"
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown'

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dbCredentials, setDbCredentials] = useState({
    host: '',
    user: '',
    password: '',
    database: ''
  });
  const [isConnected, setIsConnected] = useState(false);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // You might want to add a new API endpoint to test the connection
      const response = await fetch('/api/testConnection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbCredentials),
      });

      if (response.ok) {
        setIsConnected(true);
        setMessages([{ text: 'Connected to database successfully!', sender: 'bot' }]);
      } else {
        const data = await response.json();
        setMessages([{ text: `Error: ${data.error}`, sender: 'bot' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([{ text: `Error: ${error.message}`, sender: 'bot' }]);
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessages([...messages, { text: input, sender: 'user' }]);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, dbCredentials }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prevMessages => [...prevMessages, { text: data.response, sender: 'bot' }]);
      } else {
        setMessages(prevMessages => [...prevMessages, { text: `Error: ${data.error}`, sender: 'bot' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { text: `Error: ${error.message}`, sender: 'bot' }]);
    }

    setInput('');
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <ModeToggle/>
      <h1 className="text-2xl font-bold mb-4">Chat with DB</h1>
      
      {!isConnected ? (
        <form onSubmit={handleCredentialsSubmit} className="mb-4">
          <Input
            type="text"
            value={dbCredentials.host}
            onChange={(e) => setDbCredentials({...dbCredentials, host: e.target.value})}
            placeholder="Host"
            required
          />
          <Input
            type="text"
            value={dbCredentials.user}
            onChange={(e) => setDbCredentials({...dbCredentials, user: e.target.value})}
            placeholder="User"
            required
          />
          <Input
            type="password"
            value={dbCredentials.password}
            onChange={(e) => setDbCredentials({...dbCredentials, password: e.target.value})}
            placeholder="Password"
            required
          />
          <Input
            type="text"
            value={dbCredentials.database}
            onChange={(e) => setDbCredentials({...dbCredentials, database: e.target.value})}
            placeholder="Database"
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect to Database'}
          </Button>
        </form>
      ) : (
        <>
          <div className="bg-100 p-4 h-96 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span>
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow p-2 border rounded-l"
              placeholder="Ask a question about your database..."
              disabled={isLoading}
            />
            <Button type="submit" className="bg-blue-500 text-white p-2 rounded-r" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}