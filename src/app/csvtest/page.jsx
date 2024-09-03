"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, BarChart2, MessageSquare } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactMarkdown from 'react-markdown'

const Spinner = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
)
export default function Home() {
  const [file, setFile] = useState(null)
  const [summary, setSummary] = useState('')
  const [selectedGoal, setSelectedGoal] = useState('')
  const [image, setImage] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState([])
  const [xAxis, setXAxis] = useState('')
  const [yAxis, setYAxis] = useState('')
  const [goal, setGoal] = useState('')
  const [goals, setGoals] = useState([])


  const fetchColumns = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/columns', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setColumns(data.columns)
    } catch (error) {
      console.error('Error fetching columns:', error)
      setError('Failed to fetch columns. Please try again.')
    }
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    setError('')
    if (selectedFile) {
      await fetchColumns(selectedFile)
    }
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
      setGoals(data.goals || [])
      setError('')
    } catch (error) {
      console.error('Error in summarize:', error)
      setError('Failed to summarize the file. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  const handleRelation = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }
    if (!goal) {
      setError('Please select a goal')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('goal', goal)

    setLoading(true)
    try {
      const response = await fetch('/api/relation', {
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
  const handleVisualize = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }
    if (!xAxis || !yAxis) {
      setError('Please select both X and Y axes')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('xAxis', xAxis)
    formData.append('yAxis', yAxis)

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
          <TabsTrigger value="relation">
            <MessageSquare className="mr-2 h-4 w-4" />
            Relation
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

        <TabsContent value="relation">
          <Card>
            <CardHeader>
              <CardTitle>Relation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals && goals.length > 0 ? (
                      goals.map((g, index) => (
                        <SelectItem key={index} value={g}>
                          {g}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-goals" disabled>
                        No goals available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleRelation}
                  disabled={loading || !goal || goals.length === 0}
                >
                  Generate Visualization
                </Button>
              </div>
              {image && <img src={`data:image/png;base64,${image}`} alt="Visualization" className="mt-4 w-auto h-auto" />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization">
          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Select value={xAxis} onValueChange={setXAxis}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select X-axis" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={yAxis} onValueChange={setYAxis}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Y-axis" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleVisualize}
                  disabled={loading || !xAxis || !yAxis}
                >
                  Generate Visualization
                </Button>
              </div>
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