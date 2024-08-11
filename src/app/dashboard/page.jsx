"use client"
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern';
import { cn } from '@/lib/utils';
import NewChatForm from '@/components/NewChatForm';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';

export default function Dashboard() {
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
    filename: '',
  });
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [fileData, setFileData] = useState(null);

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
          dbInfo: chatData.dbInfo,
          fileData: chatData.file
        })
      });

      if (response.ok) {
        const data = await response.json();
        setChatId(data.chatId);
        setChats([...chats, { id: data.chatId, name: chatData.chatName, dbType: chatData.dbType }]);
        setDbCredentials(chatData.dbInfo);
        setDbType(chatData.dbType);
        if (chatData.file) {
          setFileData(chatData.file);
        }
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
        body: JSON.stringify({ chatId, query: input, dbCredentials, dbType, fileData })
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

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="grid h-screen w-full pl-[56px]">
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
      <Sidebar />
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Chat with DB</h1>
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => setShowNewChatForm(true)}>
            New Chat
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>Logout</Button>
        </header>
        <main className="flex-1 overflow-hidden">
          {showNewChatForm ? (
            <NewChatForm onSubmit={handleCreateChat} onCancel={() => setShowNewChatForm(false)} />
          ) : (
            <ChatArea
              chatId={chatId}
              messages={messages}
              isLoading={isLoading}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
            />
          )}
        </main>
      </div>
    </div>
  );
}