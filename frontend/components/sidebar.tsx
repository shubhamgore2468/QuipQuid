"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Target, Settings, HelpCircle, Menu, X, Home, PieChart, History, Split } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 rounded-md p-2 bg-[#6C16C7] text-white md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#6C16C7] to-[#5A12A7] text-white shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b border-white/10">
            <div className="h-10 w-10 rounded-md bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <PieChart size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">QuipQuid</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <NavItem href="/" icon={<Home />} active={pathname === "/"}>
              Home
            </NavItem>
            <NavItem href="/dashboard" icon={<BarChart3 />} active={pathname === "/dashboard"}>
              Dashboard
            </NavItem>
            <NavItem href="/goals" icon={<Target />} active={pathname === "/goals"}>
              Goals
            </NavItem>
            <NavItem href="/split" icon={<Split />} active={pathname === "/split"}>
              Split
            </NavItem>
            <NavItem href="/history" icon={<History />} active={pathname === "/history"}>
              History
            </NavItem>
            <NavItem href="/settings" icon={<Settings />} active={pathname === "/settings"}>
              Settings
            </NavItem>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <NavItem href="/help" icon={<HelpCircle />} active={pathname === "/help"}>
              Help & FAQ
            </NavItem>
          </div>
        </div>
      </aside>
    </>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
}

function NavItem({ href, icon, children, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10",
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}
