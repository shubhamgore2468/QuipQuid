"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    setIsOpen(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        {isLoggedIn ? (
          <>
            <div className="w-8 h-8 rounded-full bg-[#6C16C7] flex items-center justify-center text-white font-medium">
              JD
            </div>
            <span className="hidden sm:inline font-medium">John Doe</span>
            <ChevronDown size={16} />
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <User size={16} className="text-slate-500 dark:text-slate-400" />
            </div>
            <span className="hidden sm:inline font-medium">Sign In</span>
            <ChevronDown size={16} />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">john.doe@example.com</p>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-slate-100 dark:hover:bg-slate-700 border-t border-slate-200 dark:border-slate-700"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#6C16C7] hover:bg-purple-700"
                  >
                    Sign in
                  </button>
                  <div className="px-4 py-2 text-center text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{" "}
                    <a href="#" className="text-[#6C16C7] hover:underline">
                      Sign up
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
