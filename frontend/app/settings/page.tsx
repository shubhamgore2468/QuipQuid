"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { FloatingChatBar } from "@/components/floating-chat-bar"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (selectedTheme: string) => {
    setTheme(selectedTheme)
  }

  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-r from-coastal-dark to-coastal-teal rounded-lg p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 opacity-90">Customize your account preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-coastal-dark rounded-lg shadow p-4">
              <nav className="space-y-1">
                {[
                  { name: "Profile", active: false },
                  { name: "Account", active: false },
                  { name: "Notifications", active: false },
                  { name: "Appearance", active: true },
                  { name: "Security", active: false },
                  { name: "Billing", active: false },
                  { name: "Integrations", active: false },
                ].map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className={`block px-4 py-2 rounded-md ${
                      item.active
                        ? "bg-coastal-teal/10 text-coastal-teal dark:bg-coastal-teal/20 dark:text-coastal-teal"
                        : "hover:bg-coastal-dark/5 dark:hover:bg-coastal-teal/10"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="md:col-span-2">
            {/* Theme Settings Card */}
            <div className="bg-white dark:bg-coastal-dark rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Appearance</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Theme</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <ThemeOption
                      title="Light"
                      selected={mounted && theme === "light"}
                      onClick={() => handleThemeChange("light")}
                      preview={
                        <div className="bg-white border border-coastal-dark/10 rounded-md p-2 h-full">
                          <div className="h-2 w-8 bg-coastal-dark rounded mb-2"></div>
                          <div className="h-2 w-12 bg-coastal-dark/20 rounded mb-2"></div>
                          <div className="h-2 w-10 bg-coastal-dark/20 rounded"></div>
                        </div>
                      }
                    />

                    <ThemeOption
                      title="Dark"
                      selected={mounted && theme === "dark"}
                      onClick={() => handleThemeChange("dark")}
                      preview={
                        <div className="bg-coastal-dark border border-coastal-teal/20 rounded-md p-2 h-full">
                          <div className="h-2 w-8 bg-white rounded mb-2"></div>
                          <div className="h-2 w-12 bg-coastal-teal/40 rounded mb-2"></div>
                          <div className="h-2 w-10 bg-coastal-teal/40 rounded"></div>
                        </div>
                      }
                    />

                    <ThemeOption
                      title="System"
                      selected={mounted && theme === "system"}
                      onClick={() => handleThemeChange("system")}
                      preview={
                        <div className="bg-gradient-to-r from-white to-coastal-dark border border-coastal-dark/10 rounded-md p-2 h-full">
                          <div className="h-2 w-8 bg-coastal-dark/60 rounded mb-2"></div>
                          <div className="h-2 w-12 bg-coastal-dark/40 rounded mb-2"></div>
                          <div className="h-2 w-10 bg-coastal-dark/40 rounded"></div>
                        </div>
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-coastal-dark/10 dark:border-coastal-teal/10">
                  <div>
                    <h3 className="font-medium">Toggle Theme</h3>
                    <p className="text-sm text-coastal-dark/60 dark:text-coastal-teal/60">
                      Quickly switch between light and dark mode
                    </p>
                  </div>
                  <ThemeToggle className="h-10 w-10" />
                </div>

                <div className="pt-4 border-t border-coastal-dark/10 dark:border-coastal-teal/10">
                  <h3 className="font-medium mb-2">Color Accent</h3>
                  <p className="text-sm text-coastal-dark/60 dark:text-coastal-teal/60 mb-4">
                    Choose your preferred accent color
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: "Teal", color: "#2A9D8F", selected: true },
                      { name: "Dark", color: "#264653", selected: false },
                      { name: "Gold", color: "#E9C46A", selected: false },
                      { name: "Orange", color: "#F4A261", selected: false },
                      { name: "Coral", color: "#E76F51", selected: false },
                    ].map((color) => (
                      <button
                        key={color.name}
                        className={`w-8 h-8 rounded-full relative ${color.selected ? "ring-2 ring-offset-2 ring-coastal-dark/30 dark:ring-coastal-teal/60" : ""}`}
                        style={{ backgroundColor: color.color }}
                        title={color.name}
                      >
                        <span className="sr-only">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Settings Card */}
            <div className="bg-white dark:bg-coastal-dark rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 pb-6 border-b border-coastal-dark/10 dark:border-coastal-teal/10">
                <div className="w-24 h-24 bg-coastal-teal/20 dark:bg-coastal-teal/30 rounded-full flex items-center justify-center text-coastal-teal text-4xl font-bold">
                  JD
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">Profile Photo</h3>
                  <p className="text-coastal-dark/60 dark:text-coastal-teal/60 mb-4">
                    This will be displayed on your profile
                  </p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-coastal-teal text-white rounded-md hover:bg-coastal-teal/90">
                      Upload new photo
                    </button>
                    <button className="px-4 py-2 border border-coastal-dark/20 dark:border-coastal-teal/20 rounded-md hover:bg-coastal-dark/5 dark:hover:bg-coastal-teal/10">
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      defaultValue="John"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coastal-teal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coastal-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coastal-teal"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    rows={4}
                    defaultValue="I'm a finance enthusiast looking to improve my budgeting skills."
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-coastal-teal"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-coastal-teal text-white rounded-md hover:bg-coastal-teal/90"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <FloatingChatBar />
    </>
  )
}

interface ThemeOptionProps {
  title: string
  selected: boolean
  onClick: () => void
  preview: React.ReactNode
}

function ThemeOption({ title, selected, onClick, preview }: ThemeOptionProps) {
  return (
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-all ${
        selected
          ? "border-coastal-teal bg-coastal-teal/10 dark:bg-coastal-teal/20"
          : "border-coastal-dark/10 dark:border-coastal-teal/10 hover:border-coastal-teal/50 dark:hover:border-coastal-teal/50"
      }`}
      onClick={onClick}
    >
      <div className="h-24 mb-2">{preview}</div>
      <div className="flex items-center justify-between">
        <span className="font-medium">{title}</span>
        {selected && <div className="w-4 h-4 rounded-full bg-coastal-teal"></div>}
      </div>
    </div>
  )
}
