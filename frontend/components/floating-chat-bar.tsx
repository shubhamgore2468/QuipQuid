"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Send, Mic, Smile, ImageIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface FloatingChatBarProps {
  onSendMessage?: (content: string, image?: File) => void;
}

export function FloatingChatBar({ onSendMessage }: FloatingChatBarProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open chat when user starts typing
  const handleInputFocus = () => {
    router.push("/chat");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedImage) {
      // If onSendMessage prop is provided, use it to send the message
      if (onSendMessage) {
        onSendMessage(message.trim(), selectedImage || undefined);
      } else {
        console.log("Message sent:", message);
        console.log("Image sent:", selectedImage);
      }

      // Clear input fields
      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);

      // Navigate to chat page if not already there
      router.push("/chat");
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Navigate to chat page
      router.push("/chat");
    }
  };

  const handleVoiceInput = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);

      // Navigate to chat page
      router.push("/chat");

      // This is a placeholder for actual voice recording functionality
      console.log("Voice recording started");
    } else {
      // Stop recording
      setIsRecording(false);
      console.log("Voice recording stopped");
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 left-0 right-0 z-50 px-4 md:px-6 ">
      <div className="bg-gradient-to-r from-theme-navy to-theme-navyLight p-3 shadow-lg border-t rounded-full border-theme-navy/10 dark:border-white/10">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {imagePreview && (
            <div className="mb-2 relative inline-block">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Selected"
                className="h-20 rounded-md object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-theme-orange text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageSelect}
            />

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
                placeholder="Ask about your budget"
                className="w-full py-2 px-4 bg-white/20 text-white placeholder-white/70 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/80 hover:text-white"
              >
                {/* <Smile size={20} /> */}
                {/* <span className="sr-only">Add emoji</span> */}
              </button>
            </div>

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-full ${
                isRecording
                  ? "bg-theme-orange text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Mic size={20} />
              <span className="sr-only">Voice input</span>
            </button>

            <button
              type="submit"
              className="p-2 rounded-full bg-theme-orange text-white hover:bg-theme-orangeDark disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!message.trim() && !selectedImage}
            >
              <Send size={20} />
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
