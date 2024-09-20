"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatArea from '@/components/ChatArea'
import NewChatForm from '@/components/NewChatForm'
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

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


  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster />
      <div className="w-60 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
        <Sidebar
          onNewChat={() => setShowNewChatForm(true)}
          chats={chats}
          activeChatId={chatId}
          onChatSelect={(id) => setChatId(id)}
          className={"mr-4"}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
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
              className="p-6"
            />
          )}
      </main>
      </div>
    </div>
  )
}