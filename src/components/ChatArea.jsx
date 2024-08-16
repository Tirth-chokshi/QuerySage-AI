"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { CornerDownLeft} from 'lucide-react';
import { Textarea } from './ui/textarea';

export default function ChatArea({ chatId, messages, isLoading, input, setInput, handleSubmit }) {
  if (!chatId) {
    return <div className="flex items-center justify-center h-full">Select or create a chat to begin.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div  className="flex items-center p-3 pt-0">
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <Textarea
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <Button type="submit" disabled={isLoading}>
          Send Message
            {isLoading ? 'Sending...' : <CornerDownLeft className="h-4 w-4" />}
          </Button>
        </div>
      </form>
    </div>
  );
}