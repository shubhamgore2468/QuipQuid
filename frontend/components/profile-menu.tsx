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
        className="flex items-center gap-2 p-2 rounded-full hover:bg-theme-navy/10 dark:hover:bg-theme-navy/40"
      >
        {isLoggedIn ? (
          <>
            <div className="w-8 h-8 rounded-full bg-theme-navy flex items-center justify-center text-white font-medium">
              JD
            </div>
            <span className="hidden sm:inline font-medium">John Doe</span>
            <ChevronDown size={16} />
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-theme-navy/10 dark:bg-theme-navy/30 flex items-center justify-center">
              <User size={16} className="text-theme-navy/60 dark:text-white/60" />
            </div>
            <span className="hidden sm:inline font-medium">Sign In</span>
            <ChevronDown size={16} />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-theme-navy ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              {isLoggedIn ? (
                <>
                  <div className="px-4 py-2 border-b border-theme-navy/10 dark:border-white/10">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-theme-navy/60 dark:text-white/60">john.doe@example.com</p>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-theme-navy/10 dark:hover:bg-theme-navy/40"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-theme-orange/10 dark:hover:bg-theme-orange/20 border-t border-theme-navy/10 dark:border-white/10"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-theme-orange hover:bg-theme-orangeDark"
                  >
                    Sign in
                  </button>
                  <div className="px-4 py-2 text-center text-sm text-theme-navy/60 dark:text-white/60">
                    Don't have an account?{" "}
                    <a href="#" className="text-theme-orange hover:underline">
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
