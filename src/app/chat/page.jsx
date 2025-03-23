"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import ChatArea from '@/components/ChatArea'
import NewChatForm from '@/components/NewChatForm'
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button'
import { Settings, LogOut, History, MessageCirclePlus, Database, Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Drawer,
  DrawerContent,
  DrawerTrigger
} from "@/components/ui/drawer"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

const logo = "/logo.svg";

export default function Chat() {
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [chatId, setChatId] = useState(null)
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showNewChatForm, setShowNewChatForm] = useState(false)
  const [dbType, setDbType] = useState('')
  const [dbCredentials, setDbCredentials] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    uri: '',
    filename: '',
    connectionString: '',
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeChatName, setActiveChatName] = useState("")

  // Load chats on mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchChats()
    }
  }, [session])

  // Set the chat name when chatId changes
  useEffect(() => {
    if (chatId) {
      const chat = chats.find(c => c.id === chatId)
      if (chat) {
        setActiveChatName(chat.name)
      }
    } else {
      setActiveChatName("")
    }
  }, [chatId, chats])

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect('/login')
    }
  }, [status])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-sm text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  async function fetchChats() {
    try {
      const response = await fetch('/api/getChats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        setChats(data.chats)
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
      toast({
        title: "Error",
        description: "Failed to load your chats",
        variant: "destructive",
      })
    }
  }

  const handleCreateChat = async (chatData) => {
    if (!session || !session.user) {
      console.error('No user session found')
      setMessages([{ text: 'Error: No user session found', sender: 'bot' }])
      return
    }

    try {
      // Test the database connection
      const connectionResponse = await fetch('/api/testConnection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dbType: chatData.dbType,
          dbInfo: chatData.dbInfo
        })
      })

      if (connectionResponse.ok) {
        toast({
          title: "Success",
          description: "Database connection successful!",
          variant: "default",
        })

        // Proceed with chat creation
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
        })

        if (response.ok) {
          const data = await response.json()
          setChatId(data.chatId)
          setChats(prev => [...prev, { id: data.chatId, name: chatData.chatName, dbType: chatData.dbType }])
          setDbCredentials(chatData.dbInfo)
          setDbType(chatData.dbType)
          if (chatData.file) {
            setFileData(chatData.file)
          }
          setShowNewChatForm(false)
          setSidebarOpen(false)
          setMessages([])
          toast({
            title: "Success",
            description: "Chat created successfully!",
            variant: "default",
          })

        } else {
          const data = await response.json()
          toast({
            title: "Error",
            description: `Error creating chat: ${data.error}`,
            variant: "destructive",
          })
        }
      } else {
        const errorData = await connectionResponse.json()
        toast({
          title: "Error",
          description: `Database connection failed: ${errorData.error}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: `Error: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const handleChatSelect = async (id) => {
    if (id === chatId) return
    
    setChatId(id)
    setMessages([])
    
    // Load chat messages here if you want to persist them
    try {
      const response = await fetch(`/api/getChatMessages?chatId=${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages)
        }
        
        // Also load DB credentials for this chat
        if (data.dbInfo) {
          setDbCredentials(data.dbInfo)
          setDbType(data.dbType)
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error)
    }
    
    setSidebarOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    
    setIsLoading(true)
    const newMessage = { text: input, sender: 'user' }
    setMessages(prevMessages => [...prevMessages, newMessage])
    setInput('')
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, query: input, dbCredentials, dbType })
      })
      const data = await response.json()
      let botMessage
      if (response.ok) {
        botMessage = { text: data.response, sender: 'bot' }
      } else {
        botMessage = { text: `Error: ${data.error}`, sender: 'bot' }
      }
      setMessages(prevMessages => [...prevMessages, botMessage])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prevMessages => [...prevMessages, { text: `Error: ${error.message}`, sender: 'bot' }])
    }

    setIsLoading(false)
  }

  const getDbIcon = (type) => {
    switch(type) {
      case 'mongodb': return '🍃';
      case 'mysql': return '🐬';
      case 'postgresql': return '🐘';
      case 'sqlite': return '🔄';
      case 'neondb': return '✨';
      default: return '💾';
    }
  }

  function SidebarButton({ icon, label, onClick }) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label={label}
              onClick={onClick}
            >
              {icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-background/95">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-3 border-b">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <img src={logo} alt="QuerySage Logo" className="h-6 w-auto" />
                  <span className="font-semibold text-primary">QuerySage</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-3">
                <Button
                  onClick={() => {
                    setShowNewChatForm(true)
                    setSidebarOpen(false)
                  }}
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageCirclePlus className="h-4 w-4" />
                  New Chat
                </Button>
              </div>
              
              <ScrollArea className="flex-1 px-2 py-3">
                <div className="space-y-1">
                  {chats.length > 0 ? (
                    chats.map((chat) => (
                      <Button
                        key={chat.id}
                        variant={chat.id === chatId ? "secondary" : "ghost"}
                        onClick={() => handleChatSelect(chat.id)}
                        className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium"
                      >
                        <span className="mr-1">{getDbIcon(chat.dbType)}</span>
                        {chat.name}
                      </Button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="mx-auto h-10 w-10 opacity-20 mb-2" />
                      <p className="text-sm">No chats yet</p>
                      <p className="text-xs">Create a new chat to get started</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="mt-auto p-4 border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                          {session.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="font-medium">{session.user?.name || 'User'}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 mx-2 text-center">
          {activeChatName ? (
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium truncate max-w-[200px]">{activeChatName}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">QuerySage</span>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:w-64 border-r flex-col flex-shrink-0 bg-background/50 backdrop-blur-sm">
          <div className="p-4 border-b flex items-center gap-2">
            <Link href="/dashboard" className="flex-shrink-0">
              <img src={logo} alt="QuerySage Logo" className="h-8 w-auto" />
            </Link>
            <span className="font-semibold text-primary">QuerySage</span>
          </div>
          
          <div className="p-3">
            <Button
              onClick={() => setShowNewChatForm(true)}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <MessageCirclePlus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant={chat.id === chatId ? "secondary" : "ghost"}
                    onClick={() => handleChatSelect(chat.id)}
                    className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium group relative"
                  >
                    <span className="mr-1">{getDbIcon(chat.dbType)}</span>
                    <span className="truncate">{chat.name}</span>
                  </Button>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Database className="mx-auto h-12 w-12 opacity-20 mb-3" />
                  <p>No chats yet</p>
                  <p className="text-sm">Create a new chat to get started</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Bottom user section */}
          <div className="mt-auto p-3 border-t bg-background/60">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {session.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{session.user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Desktop header with chat name */}
          {chatId && activeChatName && (
            <div className="hidden md:flex items-center h-14 border-b px-4 bg-background/60 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{activeChatName}</span>
                <div className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs font-medium">
                  {dbType}
                </div>
              </div>
            </div>
          )}
          
          <ChatArea
            chatId={chatId}
            messages={messages}
            isLoading={isLoading}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* New chat form modal */}
      {showNewChatForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <NewChatForm
            onSubmit={handleCreateChat}
            onCancel={() => setShowNewChatForm(false)}
          />
        </div>
      )}
      
      <Toaster />
    </div>
  )
}