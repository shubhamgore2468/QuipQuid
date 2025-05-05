"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Send, Mic, Smile, ImageIcon, X } from "lucide-react"
import { useRouter } from "next/navigation"

export function FloatingChatBar() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Open chat when user starts typing
  const handleInputFocus = () => {
    router.push("/chat")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() || selectedImage) {
      console.log("Message sent:", message)
      console.log("Image sent:", selectedImage)
      setMessage("")
      setSelectedImage(null)
      setImagePreview(null)

      // Navigate to chat page
      router.push("/chat")
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Navigate to chat page
      router.push("/chat")
    }
  }

  const handleVoiceInput = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true)

      // Navigate to chat page
      router.push("/chat")

      // This is a placeholder for actual voice recording functionality
      console.log("Voice recording started")
    } else {
      // Stop recording
      setIsRecording(false)
      console.log("Voice recording stopped")
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-50 px-4 md:px-6">
      <div className="bg-gradient-to-r from-theme-navy to-theme-navyLight backdrop-blur-sm rounded-full shadow-lg max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-center p-1">
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <ImageIcon size={20} />
            <span className="sr-only">Upload image</span>
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={handleInputFocus}
              placeholder="Ask about your finances..."
              className="w-full py-2 px-4 bg-white/20 text-white placeholder-white/70 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/80 hover:text-white"
            >
              <Smile size={18} />
              <span className="sr-only">Add emoji</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2 rounded-full ${
              isRecording ? "bg-theme-orange text-white" : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <Mic size={20} />
            <span className="sr-only">Voice input</span>
          </button>

          <button
            type="submit"
            className="p-2 rounded-full bg-theme-orange text-white hover:bg-theme-orangeDark"
            disabled={!message.trim() && !selectedImage}
          >
            <Send size={20} />
            <span className="sr-only">Send message</span>
          </button>
        </form>

        {imagePreview && (
          <div className="absolute bottom-16 right-0 p-2 bg-white dark:bg-theme-navy rounded-lg shadow-lg">
            <div className="relative">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Selected"
                className="h-20 w-20 rounded-md object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-theme-orange text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
