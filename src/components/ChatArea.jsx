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
        <p className="text-lg text-muted-foreground">Select or create a chat to begin.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 h-[calc(100vh-200px)] p-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-6 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={cn(
                "inline-block max-w-[70%] px-6 py-4 rounded-lg shadow-md transition-all duration-200",
                message.sender === 'user' 
                  ? "bg-blue-500/10 backdrop-blur-sm hover:bg-blue-500/15" 
                  : "bg-background/80 backdrop-blur-sm border border-border/50 hover:border-blue-500/50"
              )}
            >
              <div className="flex items-center mb-2">
                {message.sender === 'user' ? (
                  <User className="h-5 w-5 mr-2 text-blue-400" />
                ) : (
                  <Bot className="h-5 w-5 mr-2 text-purple-400" />
                )}
                <span className={cn(
                  "font-semibold",
                  message.sender === 'user' ? "text-blue-400" : "text-purple-400"
                )}>
                  {message.sender === 'user' ? 'You' : 'AI'}
                </span>
              </div>
              <div className={cn(
                "prose prose-sm max-w-none",
                message.sender === 'user' ? "prose-blue" : "prose-purple"
              )}>
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-6 flex justify-start">
            <div className="inline-block max-w-[70%] px-6 py-4 rounded-lg shadow-md bg-background/80 backdrop-blur-sm border border-border/50">
              <div className="flex items-center mb-2">
                <Bot className="h-5 w-5 mr-2 text-purple-400" />
                <span className="font-semibold text-purple-400">AI</span>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="border-t border-border/10 bg-background/95 backdrop-blur p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 min-h-[50px] max-h-[200px] resize-y transition-all duration-200 border-border/50 focus:border-blue-500/50 hover:border-blue-500/30 bg-background/50"
            />
            <Button 
              type="submit" 
              disabled={isLoading} 
              size="icon"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}