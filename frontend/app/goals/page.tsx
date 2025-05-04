import { GoalsSection } from "@/components/goals-section"
import { ChatBar } from "@/components/chat-bar"

export default function GoalsPage() {
  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="mt-2 opacity-90">Track your financial goals and achievements</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <GoalsSection />

          {/* Additional goals content */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Goal</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g., New Car, Vacation, etc."
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Target Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Target Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Initial Deposit (Optional)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#6C16C7] text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Create Goal
              </button>
            </form>
          </div>
        </div>
      </div>
      <ChatBar />
    </>
  )
}
