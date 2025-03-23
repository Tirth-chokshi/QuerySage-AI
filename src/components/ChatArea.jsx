"use client"
import React, { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import { Send, Bot, User, Copy, ThumbsUp, ThumbsDown, Code } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function ChatArea({ chatId, messages, isLoading, input, setInput, handleSubmit }) {
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize the textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Handle keyboard shortcut (Ctrl + Enter) to submit
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      if (input.trim()) {
        handleSubmit(e)
      }
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // You could add a toast notification here
        console.log('Copied to clipboard')
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }

  if (!chatId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
        <div className="rounded-full bg-blue-500/10 p-4">
          <Bot className="h-10 w-10 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold">Database Assistant</h3>
        <p className="text-muted-foreground max-w-md">
          Connect to your database and start a conversation to query and analyze your data.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="flex flex-col gap-6 p-6">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "group animate-in fade-in duration-200",
                  message.sender === 'user' ? "items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "flex gap-3 max-w-3xl",
                  message.sender === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.sender === 'user' ? "bg-blue-500/10" : "bg-purple-500/10"
                  )}>
                    {message.sender === 'user' ? (
                      <User className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Bot className="h-5 w-5 text-purple-500" />
                    )}
                  </div>
                  <div className={cn(
                    "flex-1 px-4 py-3 rounded-lg",
                    message.sender === 'user' 
                      ? "bg-blue-500/10 text-foreground" 
                      : "bg-background border border-border/50 shadow-sm"
                  )}>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '')
                            const language = match ? match[1] : 'text'
                            
                            if (inline) {
                              return <code className="rounded bg-muted px-1 py-0.5 text-sm font-mono" {...props}>{children}</code>
                            }
                            
                            return (
                              <div className="relative my-3 overflow-hidden rounded-lg border border-border/50 bg-black/50">
                                <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border/50">
                                  <div className="text-xs font-medium text-muted-foreground">
                                    {language}
                                  </div>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                          onClick={() => copyToClipboard(String(children))}
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Copy code</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <pre className="p-4 overflow-x-auto text-sm">
                                  <code className="font-mono">{children}</code>
                                </pre>
                              </div>
                            )
                          },
                          table: ({ node, ...props }) => (
                            <div className="my-4 w-full overflow-auto rounded-lg border border-border/50">
                              <table className="w-full border-collapse" {...props} />
                            </div>
                          ),
                          th: ({ node, ...props }) => (
                            <th className="border border-border/50 px-4 py-2 text-left font-semibold bg-muted/30" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="border border-border/50 px-4 py-2" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="mb-4 last:mb-0" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="my-4 ml-6 list-disc" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="my-4 ml-6 list-decimal" {...props} />
                          ),
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                    {message.sender !== 'user' && (
                      <div className="flex gap-2 mt-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                                <Copy className="h-3.5 w-3.5" onClick={() => copyToClipboard(message.text)} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Copy message</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-green-500">
                                <ThumbsUp className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Helpful</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:text-red-500">
                                <ThumbsDown className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>Not helpful</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex gap-3 max-w-3xl">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/10">
                    <Bot className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1 px-4 py-3 rounded-lg bg-background border border-border/50 shadow-sm">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-3/4 bg-muted/50" />
                      <Skeleton className="h-4 w-1/2 bg-muted/50" />
                      <Skeleton className="h-4 w-2/3 bg-muted/50" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      <div className="p-4 border-t border-border/60 bg-background/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="relative flex-1 overflow-hidden rounded-lg border border-input focus-within:ring-1 focus-within:ring-blue-500/40 focus-within:border-blue-500/40">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your database..."
              className="min-h-[60px] max-h-[200px] border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 py-3"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 text-xs text-muted-foreground">
              {input.trim().length > 0 ? 'Ctrl + Enter to send' : ''}
            </div>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            size="icon"
            className="h-[60px] w-[60px] rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}