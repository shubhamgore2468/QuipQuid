"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Bot, User, Search, History, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { FloatingChatBar } from "@/components/floating-chat-bar"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  image?: string
  isStreaming?: boolean
}

interface ChatSession {
  id: string
  title: string
  preview: string
  date: string
  unread?: boolean
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your financial assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [showMobileHistory, setShowMobileHistory] = useState(false)

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "current",
      title: "Current Chat",
      preview: "Hello! I'm your financial assistant...",
      date: "Just now",
      unread: true,
    },
    {
      id: "budget-help",
      title: "Budget Help",
      preview: "I need help creating a monthly budget...",
      date: "Yesterday",
    },
    {
      id: "investment",
      title: "Investment Advice",
      preview: "What are some good investment options...",
      date: "May 1",
    },
    {
      id: "savings",
      title: "Savings Plan",
      preview: "How much should I save each month...",
      date: "Apr 28",
    },
    {
      id: "debt",
      title: "Debt Repayment",
      preview: "I want to pay off my credit card debt...",
      date: "Apr 25",
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simulate streaming effect when a new message is added
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]

    if (lastMessage && lastMessage.isStreaming) {
      const fullContent = lastMessage.content
      let currentContent = ""
      let charIndex = 0

      const streamInterval = setInterval(() => {
        if (charIndex < fullContent.length) {
          currentContent += fullContent[charIndex]
          charIndex++

          setMessages((prev) =>
            prev.map((msg) => (msg.id === lastMessage.id ? { ...msg, content: currentContent } : msg)),
          )
        } else {
          clearInterval(streamInterval)
          setMessages((prev) => prev.map((msg) => (msg.id === lastMessage.id ? { ...msg, isStreaming: false } : msg)))
        }
      }, 30) // Adjust speed as needed

      return () => clearInterval(streamInterval)
    }
  }, [messages])

  // Simulate receiving a response when a new user message is added
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]

    if (lastMessage && lastMessage.sender === "user") {
      // Wait a moment before "assistant" responds
      const timeout = setTimeout(() => {
        let responseContent = ""

        if (lastMessage.content.toLowerCase().includes("budget")) {
          responseContent =
            "I can help you create a budget! First, let's analyze your income and expenses. What's your monthly income?"
        } else if (lastMessage.content.toLowerCase().includes("invest")) {
          responseContent =
            "Investment is a great way to grow your wealth! Based on your risk profile, I can suggest some investment options. Would you prefer low-risk, medium-risk, or high-risk investments?"
        } else if (lastMessage.image) {
          responseContent =
            "I see you've shared an image. It looks like a receipt. Would you like me to analyze your spending or add these expenses to your budget tracker?"
        } else {
          responseContent =
            "Thanks for your message! I'm here to help with any financial questions you might have. Could you provide more details about what you're looking for?"
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: responseContent,
            sender: "assistant",
            timestamp: new Date(),
            isStreaming: true,
          },
        ])
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [messages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Close mobile history when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showMobileHistory && !target.closest(".chat-history-sidebar") && !target.closest(".history-toggle-btn")) {
        setShowMobileHistory(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMobileHistory])

  const toggleMobileHistory = () => {
    setShowMobileHistory(!showMobileHistory)
  }

  // Function to handle new messages from the chat bar
  const handleNewMessage = (content: string, image?: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date(),
        image,
      },
    ])
  }

  return (
    <div className="flex h-full">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-4 text-white flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-white/10">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="font-bold text-lg">Financial Assistant</h2>
              <p className="text-sm opacity-80">Ask me anything about your finances</p>
            </div>
          </div>

          {/* Mobile history toggle button */}
          <button
            onClick={toggleMobileHistory}
            className="history-toggle-btn md:hidden p-2 rounded-full hover:bg-white/10"
            aria-label="Toggle chat history"
          >
            {showMobileHistory ? <X size={20} /> : <History size={20} />}
          </button>
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

        {/* Keep the chat bar at the bottom */}
        <FloatingChatBar />
      </div>

      {/* Desktop chat history sidebar */}
      <div className="hidden md:flex flex-col w-80 border-l border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-lg">Chat History</h2>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full p-2 pl-8 bg-slate-100 dark:bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer ${
                session.id === "current" ? "bg-purple-50 dark:bg-purple-900/20" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{session.title}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">{session.date}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">{session.preview}</p>
              {session.unread && (
                <div className="mt-1 flex justify-end">
                  <span className="w-2 h-2 bg-[#6C16C7] rounded-full"></span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
          <button className="w-full py-2 text-center text-sm text-[#6C16C7] hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md">
            Clear History
          </button>
        </div>
      </div>

      {/* Mobile chat history sidebar (overlay) */}
      {showMobileHistory && (
        <div className="chat-history-sidebar fixed inset-y-0 right-0 z-50 w-4/5 max-w-xs flex flex-col bg-white dark:bg-slate-800 shadow-lg border-l border-slate-200 dark:border-slate-700">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="font-bold text-lg">Chat History</h2>
            <button
              onClick={() => setShowMobileHistory(false)}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full p-2 pl-8 bg-slate-100 dark:bg-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer ${
                  session.id === "current" ? "bg-purple-50 dark:bg-purple-900/20" : ""
                }`}
                onClick={() => setShowMobileHistory(false)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{session.title}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{session.date}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">{session.preview}</p>
                {session.unread && (
                  <div className="mt-1 flex justify-end">
                    <span className="w-2 h-2 bg-[#6C16C7] rounded-full"></span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-700">
            <button className="w-full py-2 text-center text-sm text-[#6C16C7] hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md">
              Clear History
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
