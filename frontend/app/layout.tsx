import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { MobileNavbar } from "@/components/mobile-navbar"
import { ProfileMenu } from "@/components/profile-menu"
import { ThemeProvider } from "@/components/theme-provider"

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex h-screen bg-gradient-to-br from-white to-theme-navy/5 dark:from-theme-navy dark:to-theme-navy/80">
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden md:block">
              <Sidebar />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="bg-white/50 dark:bg-theme-navy/50 backdrop-blur-sm border-b border-theme-navy/10 dark:border-white/10 p-4 flex items-center">
                {/* App name centered in the header */}
                <h1 className="text-xl font-bold text-theme-orange absolute left-1/2 transform -translate-x-1/2">
                  QuipQuid
                </h1>

                {/* Profile menu aligned to the right */}
                <div className="ml-auto">
                  <ProfileMenu />
                </div>
              </header>

              <main className="flex-1 overflow-auto pb-16 md:pb-0">{children}</main>

              {/* Mobile Bottom Navigation - only visible on mobile */}
              <div className="md:hidden">
                <MobileNavbar />
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
