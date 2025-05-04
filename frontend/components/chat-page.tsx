"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Bot, User } from "lucide-react"

interface ChatPageProps {
  onClose: () => void
}

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  image?: string
}

export function ChatPage({ onClose }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your financial assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-900/20">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-4 text-white flex items-center">
        <button onClick={onClose} className="mr-4 p-2 rounded-full hover:bg-white/10">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="font-bold text-lg">Financial Assistant</h2>
          <p className="text-sm opacity-80">Ask me anything about your finances</p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`
                flex items-start gap-3 max-w-[80%]
                ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}
              `}
              >
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                  ${message.sender === "user" ? "bg-[#6C16C7]" : "bg-gray-200 dark:bg-gray-700"}
                `}
                >
                  {message.sender === "user" ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-[#6C16C7] dark:text-white" />
                  )}
                </div>

                <div
                  className={`
                  rounded-lg p-3 
                  ${
                    message.sender === "user"
                      ? "bg-[#6C16C7] text-white"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                  }
                `}
                >
                  {message.image && (
                    <div className="mb-2">
                      <img
                        src={message.image || "/placeholder.svg"}
                        alt="Attached"
                        className="rounded-md max-w-full max-h-60 object-contain"
                      />
                    </div>
                  )}
                  <p>{message.content}</p>
                  <div
                    className={`
                    text-xs mt-1
                    ${message.sender === "user" ? "text-purple-200" : "text-gray-500 dark:text-gray-400"}
                  `}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input is handled by the ChatBar component */}
    </div>
  )
}
