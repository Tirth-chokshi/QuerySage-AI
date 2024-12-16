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
    connectionString: '', // Added for Neon DB
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
    <div className="flex h-screen bg-[#0A0A0A]">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <select 
            value={chatId || ''} 
            onChange={(e) => setChatId(e.target.value)}
            className="w-full bg-[#1C1C1C] text-white border border-gray-800 rounded-md p-2"
          >
            <option value="">Chat</option>
            {chats.map((chat) => (
              <option key={chat.id} value={chat.id}>
                {chat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <Button
              onClick={() => setShowNewChatForm(true)}
              className="w-full bg-[#1C1C1C] hover:bg-gray-800 text-white border border-gray-800"
            >
              <MessageCirclePlus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex flex-col gap-2">
            {/* <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() =>}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button> */}
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1">
        <ChatArea
          chatId={chatId}
          messages={messages}
          isLoading={isLoading}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
        />
      </div>

      {/* New chat form modal */}
      {showNewChatForm && (
        <NewChatForm
          onClose={() => setShowNewChatForm(false)}
          onSubmit={handleCreateChat}
        />
      )}
      
      <Toaster />
    </div>
  )
}