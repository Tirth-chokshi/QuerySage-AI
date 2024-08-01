"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ReactMarkdown from 'react-markdown'
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern'
import { cn } from "@/lib/utils"
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import Navbar from '@/components/Navbar'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [dbType, setDbType] = useState('')
  const [dbCredentials, setDbCredentials] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    uri: ''
  })
  const [file, setFile] = useState(null)
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/testConnection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dbCredentials, dbType }),
      })

      if (response.ok) {
        setIsConnected(true)
        setMessages([{ text: 'Connected to MySQL database successfully!', sender: 'bot' }])
      } else {
        const data = await response.json()
        setMessages([{ text: `Error: ${data.error}`, sender: 'bot' }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages([{ text: `Error: ${error.message}`, sender: 'bot' }])
    }

    setIsLoading(false)
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setIsConnected(true)
        setMessages([{ text: 'SQLite database uploaded successfully!', sender: 'bot' }])
      } else {
        const data = await response.json()
        setMessages([{ text: `Error: ${data.error}`, sender: 'bot' }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages([{ text: `Error: ${error.message}`, sender: 'bot' }])
    }

    setIsLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessages([...messages, { text: input, sender: 'user' }])

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, dbCredentials, dbType }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessages(prevMessages => [...prevMessages, { text: data.response, sender: 'bot' }])
      } else {
        setMessages(prevMessages => [...prevMessages, { text: `Error: ${data.error}`, sender: 'bot' }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prevMessages => [...prevMessages, { text: `Error: ${error.message}`, sender: 'bot' }])
    }

    setInput('')
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-4">
      <Navbar />

      <ContainerScroll titleComponent={"querysage"} />
    </div>
  )
}