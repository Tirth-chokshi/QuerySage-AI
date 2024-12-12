"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
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
import Link from 'next/link'
import Image from 'next/image'  
import logo from '@/components/logo.svg'
import { Settings, LogOut, History, MessageCirclePlus } from 'lucide-react';
import { signOut } from 'next-auth/react'

export default function Dashboard() {
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
  })
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
          setChats([...chats, { id: data.chatId, name: chatData.chatName, dbType: chatData.dbType }])
          setDbCredentials(chatData.dbInfo)
          setDbType(chatData.dbType)
          if (chatData.file) {
            setFileData(chatData.file)
          }
          setShowNewChatForm(false)
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
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const newMessage = { text: input, sender: 'user' }
    setMessages(prevMessages => [...prevMessages, newMessage])
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

    setInput('')
    setIsLoading(false)
  }

  function SidebarButton({ icon, label, onClick }) {
    return (
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
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster />
      <aside className="w-16 flex-shrink-0 border-r border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-full flex flex-col">
          <div className="border-b border-border/10 p-2">
            <Link href="/" className="flex items-center justify-center">
              <Image 
                src={logo} 
                alt="Logo" 
                width={32} 
                height={32} 
                className="transition-all duration-300 hover:scale-110"
              />
            </Link>
          </div>
          <TooltipProvider>
            <nav className="flex-1 flex flex-col justify-between p-2">
              <div className="space-y-2">
                <SidebarButton
                  icon={<MessageCirclePlus className="size-5 transition-colors group-hover:text-blue-500" />}
                  label="New Chat"
                  onClick={() => setShowNewChatForm(true)}
                />
                <SidebarButton 
                  icon={<History className="size-5 transition-colors group-hover:text-blue-500" />} 
                  label="History" 
                />
              </div>
              <div className="space-y-2">
                <SidebarButton 
                  icon={<Settings className="size-5 transition-colors group-hover:text-blue-500" />} 
                  label="Settings" 
                />
                <SidebarButton
                  icon={<LogOut className="size-5 transition-colors group-hover:text-blue-500" />}
                  label="Logout"
                  onClick={handleLogout}
                />
              </div>
            </nav>
          </TooltipProvider>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl pointer-events-none"></div>
        {showNewChatForm ? (
          <div className="relative">
            <NewChatForm onSubmit={handleCreateChat} onCancel={() => setShowNewChatForm(false)} />
          </div>
        ) : (
          <div className="relative flex-1">
            <ChatArea
              chatId={chatId}
              messages={messages}
              isLoading={isLoading}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              className="p-6 flex-1 overflow-y-auto"
            />
          </div>
        )}
      </main>
    </div>
  )
}