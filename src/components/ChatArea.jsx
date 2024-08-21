"use client"
// import React from 'react';
// import { Button } from '@/components/ui/button';
// import ReactMarkdown from 'react-markdown';
// import { CornerDownLeft} from 'lucide-react';
// import { Textarea } from './ui/textarea';

// export default function ChatArea({ chatId, messages, isLoading, input, setInput, handleSubmit }) {
//   if (!chatId) {
//     return <div className="flex items-center justify-center h-full">Select or create a chat to begin.</div>;
//   }

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((message, index) => (
//           <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
//             <ReactMarkdown>{message.text}</ReactMarkdown>
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSubmit} className="border-t p-4">
//         <div  className="flex items-center p-3 pt-0">
//           <label htmlFor="message" className="sr-only">
//             Message
//           </label>
//           <Textarea
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your message..."
//             disabled={isLoading}
//             className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
//           />
//           <Button type="submit" disabled={isLoading}>
//             {isLoading ? 'Sending...' : <CornerDownLeft className="h-4 w-4" />}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { CornerDownLeft, Send } from 'lucide-react';
import { Textarea } from './ui/textarea';

export default function ChatArea({ chatId, messages, isLoading, input, setInput, handleSubmit }) {
  if (!chatId) {
    return (
      <Card className="flex items-center justify-center h-full">
        <CardContent>
          <p>Select or create a chat to begin.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full ">
      <CardHeader>
        <h3 className="font-bold text-lg">Chat Area</h3>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block px-4 py-3 rounded-lg shadow-sm ${
                message.sender === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-900 text-white'
              }`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>
        ))}
      </CardContent>
      <form onSubmit={handleSubmit} className="border-t">
        <div className="flex items-center p-3 pt-0 ">
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <Textarea
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 flex-1"
          />
          <Button type="submit" disabled={isLoading} className="ml-2">
            {isLoading ? <Spinner /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </form>
    </Card>
  );
}

const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
);