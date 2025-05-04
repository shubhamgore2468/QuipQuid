import { DashboardSection } from "@/components/dashboard-section"
import { GoalsSection } from "@/components/goals-section"
import { ChatBar } from "@/components/chat-bar"

export default function Home() {
  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">QuipQuid</h1>
          <p className="mt-2 opacity-90">Track, save, and achieve your financial goals</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DashboardSection />
          <GoalsSection />
        </div>
      </div>
      <ChatBar />
    </>
  )
}
