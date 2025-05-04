import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { ProfileMenu } from "@/components/profile-menu"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuipQuid - Budget App",
  description: "Track, save, and achieve your financial goals",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-900/20">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 p-4 flex justify-end">
              <ProfileMenu />
            </header>
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
