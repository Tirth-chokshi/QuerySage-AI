"use client"
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import NewChatForm from '@/components/NewChatForm';

export default function Page() {
  const { data: session, status } = useSession();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dbType, setDbType] = useState('');
  const [dbCredentials, setDbCredentials] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    uri: '',
  });
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [showNewChatForm, setShowNewChatForm] = useState(false);

  const handleCreateChat = async (chatData) => {
    if (!session || !session.user) {
      console.error('No user session found');
      setMessages([{ text: 'Error: No user session found', sender: 'bot' }]);
      return;
    }

    try {
      const response = await fetch('/api/createChat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          chatName: chatData.chatName,
          dbType: chatData.dbType,
          dbInfo: chatData.dbInfo
        })
      });

      if (response.ok) {
        const data = await response.json();
        setChatId(data.chatId);
        setChats([...chats, { id: data.chatId, name: chatData.chatName, dbType: chatData.dbType }]);
        setDbCredentials(chatData.dbInfo);
        setDbType(chatData.dbType);
        setShowNewChatForm(false);
      } else {
        const data = await response.json();
        setMessages([{ text: `Error: ${data.error}`, sender: 'bot' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([{ text: `Error: ${error.message}`, sender: 'bot' }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newMessage = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, query: input, dbCredentials, dbType })
      });
      const data = await response.json();
      let botMessage;
      if (response.ok) {
        botMessage = { text: data.response, sender: 'bot' };
      } else {
        botMessage = { text: `Error: ${data.error}`, sender: 'bot' };
      }
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { text: `Error: ${error.message}`, sender: 'bot' }]);
    }

    setInput('');
    setIsLoading(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect('/login')
    }
  }, [status])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chat with DB</h1>
        <Button variant={"destructive"} onClick={handleLogout}>Logout</Button>
      </div>
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={0.5}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
      <div>
        <Button onClick={() => setShowNewChatForm(true)}>New Chat</Button>
        {showNewChatForm && (
          <NewChatForm onSubmit={handleCreateChat} onCancel={() => setShowNewChatForm(false)} />
        )}
      </div>
      {chatId && (
        <>
          <div className="bg-100 p-4 h-96 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <ReactMarkdown>{message.text}</ReactMarkdown>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}