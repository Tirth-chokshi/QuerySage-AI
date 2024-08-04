"use client"
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ReactMarkdown from 'react-markdown'
import AnimatedGridPattern from '@/components/magicui/animated-grid-pattern'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'   
import { redirect } from 'next/navigation' 

export default function Page() {
    const { data: session, status } = useSession()

    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [dbType, setDbType] = useState('mysql')
    const [dbCredentials, setDbCredentials] = useState({
        host: '',
        user: '',
        password: '',
        database: '',
        uri: ''
    })

    const handleCredentialsSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await fetch('/api/testConnection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...dbCredentials, dbType })
            })

            if (response.ok) {
                setIsConnected(true)
                setMessages([{ text: 'Connection success!', sender: 'bot' }])
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
        const newMessage = { text: input, sender: 'user' }
        setMessages(prevMessages => [...prevMessages, newMessage])
        try {
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input, dbCredentials, dbType })
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
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Chat with DB</h1>
            <AnimatedGridPattern
                numSquares={30}
                maxOpacity={0.1}
                duration={3}
                repeatDelay={1}
                className={cn(
                    "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
                    "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
                )}
            />
            {!isConnected ? (
                <div>
                    <select value={dbType} onChange={(e) => setDbType(e.target.value)} className="mb-4">
                        <option value="select">select Type of Database</option>
                        <option value="mysql">MySQL</option>
                        <option value="mongodb">MongoDB</option>
                    </select>

                    {dbType === 'mysql' ? (
                        <form onSubmit={handleCredentialsSubmit} className="mb-4">
                            <Input
                                type="text"
                                value={dbCredentials.host}
                                onChange={(e) => setDbCredentials({ ...dbCredentials, host: e.target.value })}
                                placeholder="Host"
                                required
                            />
                            <Input
                                type="text"
                                value={dbCredentials.user}
                                onChange={(e) => setDbCredentials({ ...dbCredentials, user: e.target.value })}
                                placeholder="User"
                                required
                            />
                            <Input
                                type="password"
                                value={dbCredentials.password}
                                onChange={(e) => setDbCredentials({ ...dbCredentials, password: e.target.value })}
                                placeholder="Password"
                                required
                            />
                            <Input
                                type="text"
                                value={dbCredentials.database}
                                onChange={(e) => setDbCredentials({ ...dbCredentials, database: e.target.value })}
                                placeholder="Database"
                                required
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Connecting...' : 'Connect to MySQL Database'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleCredentialsSubmit} className="mb-4">
                            <Input
                                type="text"
                                value={dbCredentials.uri}
                                onChange={(e) => setDbCredentials({ ...dbCredentials, uri: e.target.value })}
                                placeholder="MongoDB URI"
                                required
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Connecting...' : 'Connect to MongoDB'}
                            </Button>
                        </form>
                    )}
                </div>
            ) : (
                <>
                    <div className="bg-100 p-4 h-96 overflow-y-auto mb-4">
                        {messages.map((message, index) => (
                            <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                <ReactMarkdown>{message.text}</ReactMarkdown>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="flex">
                        <Input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-grow p-2 border rounded-l"
                            placeholder="Ask a question about your database..."
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send'}
                        </Button>
                    </form>
                </>
            )}
        </div>
    )
}