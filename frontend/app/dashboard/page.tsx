import { DashboardSection } from "@/components/dashboard-section"
import { ChatBar } from "@/components/chat-bar"

export default function DashboardPage() {
  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 opacity-90">Your financial overview</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <DashboardSection />

          {/* Additional dashboard content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
              <div className="space-y-4">
                {[
                  { name: "Grocery Store", amount: -82.45, date: "Today" },
                  { name: "Salary Deposit", amount: 2450.0, date: "Yesterday" },
                  { name: "Electric Bill", amount: -94.2, date: "May 2" },
                  { name: "Online Shopping", amount: -65.99, date: "May 1" },
                ].map((transaction, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{transaction.date}</p>
                    </div>
                    <span className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Bills</h2>
              <div className="space-y-4">
                {[
                  { name: "Rent", amount: 1200, date: "May 5", status: "Upcoming" },
                  { name: "Internet", amount: 79.99, date: "May 8", status: "Upcoming" },
                  { name: "Phone Bill", amount: 45.0, date: "May 12", status: "Upcoming" },
                  { name: "Streaming Services", amount: 24.99, date: "May 15", status: "Upcoming" },
                ].map((bill, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{bill.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Due: {bill.date}</p>
                    </div>
                    <div className="text-right">
                      <p>${bill.amount.toFixed(2)}</p>
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBar />
    </>
  )
}
