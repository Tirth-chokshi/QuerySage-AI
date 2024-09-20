"use client"
import React, { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import { Send, Bot, User } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function ChatArea({ chatId, messages, isLoading, input, setInput, handleSubmit }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-gray-500">Select or create a chat to begin.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 h-[calc(100vh-200px)] p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                inline-block max-w-[70%] px-4 py-3 rounded-lg shadow-md
                ${message.sender === 'user'
                  ? 'bg-muted'
                  : 'bg-muted'}                
              `}
            >
              <div className="flex items-center mb-2">
                {message.sender === 'user' ? (
                  <User className="h-5 w-5 mr-2 text-emerald-200" />
                ) : (
                  <Bot className="h-5 w-5 mr-2 text-amber-400" />
                )}
                <span className={`font-semibold ${message.sender === 'user' ? 'text-emerald-200' : 'text-amber-600'}`}>
                  {message.sender === 'user' ? 'You' : 'AI'}
                </span>
              </div>
              <div className={`prose prose-sm max-w-none ${message.sender === 'user' ? 'prose-invert' : ''}`}>
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="inline-block max-w-[70%] px-4 py-3 rounded-lg shadow-md bg-amber-50 text-gray-800 mr-auto">
              <div className="flex items-center mb-2">
                <Bot className="h-5 w-5 mr-2 text-amber-400" />
                <span className="font-semibold text-amber-600">AI</span>
              </div>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 min-h-[50px] max-h-[200px] resize-y"
            />
            <Button type="submit" disabled={isLoading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}