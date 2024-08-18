"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, BarChart2, MessageSquare } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const Spinner = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
)

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError('')
  }

  const handleSummarize = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setSummary(data.summary)
      setGoals(data.goals)
      setError('')
    } catch (error) {
      console.error('Error in summarize:', error)
      setError('Failed to summarize the file. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVisualize = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }
    if (!selectedGoal) {
      setError('Please select a goal first')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('goal', selectedGoal)

    setLoading(true)
    try {
      const response = await fetch('/api/visualize', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setImage(data.image)
      setError('')
    } catch (error) {
      console.error('Error in visualize:', error)
      setError('Failed to generate visualization. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChat = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }
    if (!question) {
      setError('Please enter a question')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('question', question)

    setLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setAnswer(data.answer)
      setError('')
    } catch (error) {
      console.error('Error in chat:', error)
      setError('Failed to get an answer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Data Analysis App with Chat (using Groq)</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input type="file" onChange={handleFileChange} className="flex-grow" />
            <Button onClick={handleSummarize} disabled={loading || !file}>
              {loading ? <Spinner /> : <Upload className="mr-2 h-4 w-4" />}
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">
            <FileText className="mr-2 h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="visualization">
            <BarChart2 className="mr-2 h-4 w-4" />
            Visualization
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactMarkdown>{summary}</ReactMarkdown>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              {/* <Select
                value={selectedGoal}
                onValueChange={setSelectedGoal}
                className="mb-4"
              >
                <option value="">Select a goal</option>
                {goals.map((goal, index) => (
                  <option key={index} value={goal}>
                    {goal}
                  </option>
                ))}
              </Select> */}
              <select onChange={(e) => setSelectedGoal(e.target.value)} className="mb-4">
              <option value="">Select a goal</option>
              {goals.map((goal, index) => (
                <option key={index} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
            <Button onClick={handleVisualize} disabled={loading || !selectedGoal}>
              Generate Visualization
            </Button>
            {image && <img src={`data:image/png;base64,${image}`} alt="Visualization" 
            className="mt-4 w-auto h-auto"
            />}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="chat">
        <Card>
          <CardHeader>
            <CardTitle>Chat with CSV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question"
                className="flex-grow"
              />
              <Button onClick={handleChat} disabled={loading || !question}>
                Ask
              </Button>
            </div>
            {answer && (
              <Card>
                <CardContent>
                  <ReactMarkdown className="prose max-w-none">{answer}</ReactMarkdown>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div >
  )
}