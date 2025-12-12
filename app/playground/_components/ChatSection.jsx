'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../../../components/ui/button'
import { ArrowUp } from 'lucide-react'

const ChatSection = ({ messages, onSend, loading }) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }

  const handleSend = () => {
    if (!input?.trim()) return;
    onSend(input);
    setInput('')
  }

  const handleKeyDown = (e) => {
    // Send on Enter, new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='w-full shadow h-full p-4 flex flex-col bg-white'>
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col"
      >
        {messages?.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className='text-gray-400 text-center'>No Messages Yet</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role == 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[80%] ${
                  msg.role == "user" 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-lg flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                  <span className='text-gray-800'>Generating your website...</span>
                </div>
              </div>
            )}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="p-3 border-t flex items-center gap-2 bg-white">
        <textarea
          value={input}
          placeholder='Describe your website design...'
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          className='flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[120px]'
          rows={1}
        />
        <Button 
          onClick={handleSend}
          disabled={!input?.trim() || loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  )
}

export default ChatSection