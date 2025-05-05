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
        <div className="bg-gradient-to-r from-theme-navy to-theme-navyLight p-4 text-white flex items-center justify-between">
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
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-white to-theme-navy/5 dark:from-theme-navy dark:to-theme-navy/80">
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
                    ${message.sender === "user" ? "bg-theme-orange" : "bg-theme-navy text-white"}
                  `}
                  >
                    {message.sender === "user" ? <User size={16} className="text-white" /> : <Bot size={16} />}
                  </div>

                  <div
                    className={`
                    rounded-lg p-3 
                    ${
                      message.sender === "user"
                        ? "bg-theme-orange text-white"
                        : "bg-white dark:bg-theme-navy text-theme-navy dark:text-white"
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
                      ${message.sender === "user" ? "text-white/70" : "text-theme-navy/60 dark:text-white/60"}
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
      <div className="hidden md:flex flex-col w-80 border-l border-theme-navy/10 dark:border-white/10 bg-white/80 dark:bg-theme-navy/80 backdrop-blur-sm">
        <div className="p-4 border-b border-theme-navy/10 dark:border-white/10">
          <h2 className="font-bold text-lg">Chat History</h2>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full p-2 pl-8 bg-theme-navy/5 dark:bg-theme-navy/40 rounded-full focus:outline-none focus:ring-2 focus:ring-theme-orange"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-theme-navy/40 dark:text-white/40" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 border-b border-theme-navy/10 dark:border-white/10 hover:bg-theme-navy/5 dark:hover:bg-theme-navy/40 cursor-pointer ${
                session.id === "current" ? "bg-theme-orange/10 dark:bg-theme-orange/20" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{session.title}</h3>
                <span className="text-xs text-theme-navy/60 dark:text-white/60">{session.date}</span>
              </div>
              <p className="text-sm text-theme-navy/60 dark:text-white/60 truncate mt-1">{session.preview}</p>
              {session.unread && (
                <div className="mt-1 flex justify-end">
                  <span className="w-2 h-2 bg-theme-orange rounded-full"></span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-theme-navy/10 dark:border-white/10">
          <button className="w-full py-2 text-center text-sm text-theme-orange hover:bg-theme-orange/10 dark:hover:bg-theme-orange/20 rounded-md">
            Clear History
          </button>
        </div>
      </div>

      {/* Mobile chat history sidebar (overlay) */}
      {showMobileHistory && (
        <div className="chat-history-sidebar fixed inset-y-0 right-0 z-50 w-4/5 max-w-xs flex flex-col bg-white dark:bg-theme-navy shadow-lg border-l border-theme-navy/10 dark:border-white/10">
          <div className="p-4 border-b border-theme-navy/10 dark:border-white/10 flex justify-between items-center">
            <h2 className="font-bold text-lg">Chat History</h2>
            <button
              onClick={() => setShowMobileHistory(false)}
              className="p-1 rounded-full hover:bg-theme-navy/5 dark:hover:bg-theme-navy/40"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 border-b border-theme-navy/10 dark:border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full p-2 pl-8 bg-theme-navy/5 dark:bg-theme-navy/40 rounded-full focus:outline-none focus:ring-2 focus:ring-theme-orange"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-theme-navy/40 dark:text-white/40" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 border-b border-theme-navy/10 dark:border-white/10 hover:bg-theme-navy/5 dark:hover:bg-theme-navy/40 cursor-pointer ${
                  session.id === "current" ? "bg-theme-orange/10 dark:bg-theme-orange/20" : ""
                }`}
                onClick={() => setShowMobileHistory(false)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{session.title}</h3>
                  <span className="text-xs text-theme-navy/60 dark:text-white/60">{session.date}</span>
                </div>
                <p className="text-sm text-theme-navy/60 dark:text-white/60 truncate mt-1">{session.preview}</p>
                {session.unread && (
                  <div className="mt-1 flex justify-end">
                    <span className="w-2 h-2 bg-theme-orange rounded-full"></span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-theme-navy/10 dark:border-white/10">
            <button className="w-full py-2 text-center text-sm text-theme-orange hover:bg-theme-orange/10 dark:hover:bg-theme-orange/20 rounded-md">
              Clear History
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
