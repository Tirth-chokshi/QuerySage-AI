"use client"
import React, { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import { Send, Bot, User } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

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
    <div className="flex flex-col h-full relative bg-[#0A0A0A] text-white">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="flex flex-col gap-6 p-6">
            {messages.map((message, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  {message.sender === 'user' ? (
                    <User className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Bot className="h-5 w-5 text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        code: ({ node, inline, className, children, ...props }) => {
                          if (inline) {
                            return <code className="bg-gray-800 rounded px-1" {...props}>{children}</code>
                          }
                          return (
                            <div className="bg-[#1C1C1C] rounded-lg p-4 my-2">
                              <code className="text-sm font-mono text-white" {...props}>
                                {children}
                              </code>
                            </div>
                          )
                        }
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="text-gray-500 hover:text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    <button className="text-gray-500 hover:text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </button>
                    <button className="text-gray-500 hover:text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
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
          </div>
        </ScrollArea>
      </div>
      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 bg-[#1C1C1C] border-gray-800 focus:border-blue-500 text-white"
            rows={1}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}