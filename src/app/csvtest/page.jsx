"use client"
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Alert } from '@/components/ui/alert'
import { AlertTitle } from '@/components/ui/alert'

export default function Home() {
  const [file, setFile] = useState(null)
  const [summary, setSummary] = useState('')
  const [goals, setGoals] = useState([])
  const [selectedGoal, setSelectedGoal] = useState('')
  const [image, setImage] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const Spinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  )
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError("")
  }

  const handleSummarize = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    setLoading(true)
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSummary(data.summary)
      setGoals(data.goals)
      setError("")
    } catch (error) {
      console.error("Error in summarize:", error)
      setError("Failed to summarize the file. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVisualize = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }
    if (!selectedGoal) {
      setError("Please select a goal first")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("goal", selectedGoal)

    setLoading(true)
    try {
      const response = await fetch("/api/visualize", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setImage(data.image)
      setError("")
    } catch (error) {
      console.error("Error in visualize:", error)
      setError("Failed to generate visualization. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChat = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }
    if (!question) {
      setError("Please enter a question")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("question", question)

    setLoading(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAnswer(data.answer)
      setError("")
    } catch (error) {
      console.error("Error in chat:", error)
      setError("Failed to get an answer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

 return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Data Analysis App with Chat (using Groq)</h1>

      <Input type="file" onChange={handleFileChange} className="mb-4" />
      <Button onClick={handleSummarize} className="mb-4" disabled={loading}>
        Summarize
      </Button>

      {loading && (
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {error && (
        <Alert variant="error" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <div>
        <h2 className="text-2xl font-semibold mt-6">Summary</h2>
        <ReactMarkdown className="bg-gray-100 p-4 rounded-lg">{summary}</ReactMarkdown>

        <h2 className="text-2xl font-semibold mt-6">Goals</h2>
        <select onChange={(e) => setSelectedGoal(e.target.value)} className="mb-4">
          <option value="">Select a goal</option>
          {goals.map((goal, index) => (
            <option key={index} value={goal}>
              {goal}
            </option>
          ))}
        </select>
        <Button onClick={handleVisualize}>Generate Visualization</Button>
        {image && <img src={`data:image/png;base64,${image}`} alt="Visualization" />}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mt-6">Chat with CSV</h2>
        <Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question"
          className="mb-4"
        />
        <Button onClick={handleChat} disabled={loading}>
          Ask
        </Button>

        {loading && (
          <div className="flex justify-center mt-4">
            <Spinner size="lg" />
          </div>
        )}

        <ReactMarkdown className="bg-gray-100 p-4 rounded-lg mt-4">{answer}</ReactMarkdown>
      </div>
    </div>
  )
}