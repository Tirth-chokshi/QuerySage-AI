"use client"
import React, { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'
import { Send, Bot, User } from 'lucide-react'
import { Textarea } from './ui/textarea'
import { ScrollArea } from './ui/scroll-area'
import { cn } from '@/lib/utils'

export default function ChatArea({ chatId, messages, isLoading, input, setInput, handleSubmit }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!chatId) {
    return (
      <Card className="flex items-center justify-center h-full">
        <CardContent>
          <p className="text-center text-gray-500">Select or create a chat to begin.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b">
        <h3 className="font-bold text-lg">Chat #{chatId}</h3>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-200px)] p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              <div
                className={`
                inline-block max-w-[70%] px-4 py-3 rounded-lg shadow-md
                ${message.sender === 'user'
                    ? 'bg-emerald-600 text-white ml-auto'
                    : 'bg-amber-50 text-gray-800 mr-auto'}
                transition-all duration-300 ease-in-out
                hover:shadow-lg
                ${message.sender === 'user' ? 'hover:bg-emerald-700' : 'hover:bg-amber-100'}
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
              <div ref={messagesEndRef} />
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
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
              {isLoading ? <Spinner /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  )
}

const Spinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
)




{/* <div
  className={`
    inline-block max-w-[70%] px-4 py-3 rounded-lg shadow-md
    ${message.sender === 'user'
      ? 'bg-emerald-600 text-white ml-auto'
      : 'bg-amber-50 text-gray-800 mr-auto'}
    transition-all duration-300 ease-in-out
    hover:shadow-lg
    ${message.sender === 'user' ? 'hover:bg-emerald-700' : 'hover:bg-amber-100'}
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
</div> */}
