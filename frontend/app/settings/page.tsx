"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

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
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="mt-2 opacity-90">Customize your account preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
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
                        ? "bg-purple-50 text-[#6C16C7] dark:bg-purple-900/20 dark:text-purple-300"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700"
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
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
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
                        <div className="bg-white border border-slate-200 rounded-md p-2 h-full">
                          <div className="h-2 w-8 bg-slate-700 rounded mb-2"></div>
                          <div className="h-2 w-12 bg-slate-300 rounded mb-2"></div>
                          <div className="h-2 w-10 bg-slate-300 rounded"></div>
                        </div>
                      }
                    />

                    <ThemeOption
                      title="Dark"
                      selected={mounted && theme === "dark"}
                      onClick={() => handleThemeChange("dark")}
                      preview={
                        <div className="bg-slate-800 border border-slate-700 rounded-md p-2 h-full">
                          <div className="h-2 w-8 bg-white rounded mb-2"></div>
                          <div className="h-2 w-12 bg-slate-600 rounded mb-2"></div>
                          <div className="h-2 w-10 bg-slate-600 rounded"></div>
                        </div>
                      }
                    />

                    <ThemeOption
                      title="System"
                      selected={mounted && theme === "system"}
                      onClick={() => handleThemeChange("system")}
                      preview={
                        <div className="bg-gradient-to-r from-white to-slate-800 border border-slate-300 rounded-md p-2 h-full">
                          <div className="h-2 w-8 bg-slate-500 rounded mb-2"></div>
                          <div className="h-2 w-12 bg-slate-400 rounded mb-2"></div>
                          <div className="h-2 w-10 bg-slate-400 rounded"></div>
                        </div>
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <h3 className="font-medium">Toggle Theme</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Quickly switch between light and dark mode
                    </p>
                  </div>
                  <ThemeToggle className="h-10 w-10" />
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="font-medium mb-2">Color Accent</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Choose your preferred accent color</p>

                  <div className="flex flex-wrap gap-3">
                    {[
                      { name: "Purple", color: "#6C16C7", selected: true },
                      { name: "Blue", color: "#2563EB", selected: false },
                      { name: "Green", color: "#16A34A", selected: false },
                      { name: "Red", color: "#DC2626", selected: false },
                      { name: "Orange", color: "#EA580C", selected: false },
                    ].map((color) => (
                      <button
                        key={color.name}
                        className={`w-8 h-8 rounded-full relative ${color.selected ? "ring-2 ring-offset-2 ring-slate-300 dark:ring-slate-600" : ""}`}
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
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 pb-6 border-b">
                <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-[#6C16C7] text-4xl font-bold">
                  JD
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">Profile Photo</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">This will be displayed on your profile</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#6C16C7] text-white rounded-md hover:bg-purple-700">
                      Upload new photo
                    </button>
                    <button className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">
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
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="john.doe@example.com"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    rows={4}
                    defaultValue="I'm a finance enthusiast looking to improve my budgeting skills."
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-[#6C16C7] text-white rounded-md hover:bg-purple-700">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
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
          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
          : "border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700"
      }`}
      onClick={onClick}
    >
      <div className="h-24 mb-2">{preview}</div>
      <div className="flex items-center justify-between">
        <span className="font-medium">{title}</span>
        {selected && <div className="w-4 h-4 rounded-full bg-purple-500"></div>}
      </div>
    </div>
  )
}
