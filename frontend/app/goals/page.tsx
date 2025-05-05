import { GoalsSection } from "@/components/goals-section"
import { FloatingChatBar } from "@/components/floating-chat-bar"

export default function GoalsPage() {
  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-r from-theme-navy to-theme-navyLight rounded-lg p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="mt-2 opacity-90">Track your financial goals and achievements</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <GoalsSection />

          {/* Additional goals content */}
          <div className="bg-white dark:bg-theme-navy rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Goal</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g., New Car, Vacation, etc."
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Target Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Target Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-orange"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Initial Deposit (Optional)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-orange"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-theme-orange text-white py-2 rounded-md hover:bg-theme-orangeDark transition-colors"
              >
                Create Goal
              </button>
            </form>
          </div>
        </div>
      </div>
      <FloatingChatBar />
    </>
  )
}
