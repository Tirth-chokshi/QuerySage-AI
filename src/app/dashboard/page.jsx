"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import ChatArea from '@/components/ChatArea'
import NewChatForm from '@/components/NewChatForm'

export default function Dashboard() {
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
      let response
        response = await fetch('/api/createChat', {
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
      } else {
        const data = await response.json()
        setMessages([{ text: `Error: ${data.error}`, sender: 'bot' }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages([{ text: `Error: ${error.message}`, sender: 'bot' }])
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
    <div className="flex h-screen bg-background">
      <h1
        className='flex justify-center iteams-center'
      >{session.user.name}</h1>
      <Sidebar
        onNewChat={() => setShowNewChatForm(true)}
        chats={chats}
        activeChatId={chatId}
        onChatSelect={(id) => setChatId(id)}
        className={"mr-4"}
      />
      <main className="flex-1 flex flex-col">
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
            className="m-10"
          />
        )}
      </main>
    </div>
  )
}