"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, BarChart3, Target, Settings, Split } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNavbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/goals", icon: Target, label: "Goals" },
    { href: "/split", icon: Split, label: "Split" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-theme-navy border-t border-theme-navy/10 dark:border-white/10 shadow-lg z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                isActive ? "text-theme-orange" : "text-theme-navy/60 dark:text-white/60",
              )}
            >
              <item.icon size={20} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
