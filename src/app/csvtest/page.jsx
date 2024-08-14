"use client"
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [image, setImage] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSummarize = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
      setGoals(data.goals);
      setError('');
    } catch (error) {
      console.error('Error in summarize:', error);
      setError('Failed to summarize the file. Please try again.');
    }
  };

  const handleVisualize = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    if (!selectedGoal) {
      setError('Please select a goal first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('goal', selectedGoal);

    try {
      const response = await fetch('/api/visualize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setImage(data.image);
      setError('');
    } catch (error) {
      console.error('Error in visualize:', error);
      setError('Failed to generate visualization. Please try again.');
    }
  };

  const handleChat = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    if (!question) {
      setError('Please enter a question');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.answer);
      setError('');
    } catch (error) {
      console.error('Error in chat:', error);
      setError('Failed to get an answer. Please try again.');
    }
  };

  return (
    <div>
      <h1>Data Analysis App with Chat (using Groq)</h1>
      <input type="file" name="file" onChange={handleFileChange} />
      <button onClick={handleSummarize}>Summarize</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h2>Summary</h2>
        <ReactMarkdown>{summary}</ReactMarkdown>
        <h2>Goals</h2>
        <select onChange={(e) => setSelectedGoal(e.target.value)}>
          <option value="">Select a goal</option>
          {goals.map((goal, index) => (
            <option key={index} value={goal}>
              {goal}
            </option>
          ))}
        </select>
        <button onClick={handleVisualize}>Generate Visualization</button>
        {image && <img src={`data:image/png;base64,${image}`} alt="Visualization" />}
      </div>
      <div>
        <h2>Chat with CSV</h2>
        <input 
          type="text" 
          value={question} 
          onChange={(e) => setQuestion(e.target.value)} 
          placeholder="Ask a question" 
        />
        <button onClick={handleChat}>Ask</button>
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    </div>
  );
}