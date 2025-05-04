import { ChatBar } from "@/components/chat-bar"

export default function HistoryPage() {
  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="mt-2 opacity-90">View and manage your financial transactions</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2">
              <select className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Categories</option>
                <option>Income</option>
                <option>Expenses</option>
                <option>Transfers</option>
              </select>
              <select className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Last 30 Days</option>
                <option>This Month</option>
                <option>Last Month</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full p-2 pl-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute left-2.5 top-3 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-right p-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "May 3, 2023", description: "Grocery Store", category: "Food", amount: -82.45 },
                  { date: "May 2, 2023", description: "Salary Deposit", category: "Income", amount: 2450.0 },
                  { date: "May 2, 2023", description: "Electric Bill", category: "Utilities", amount: -94.2 },
                  { date: "May 1, 2023", description: "Online Shopping", category: "Shopping", amount: -65.99 },
                  { date: "Apr 30, 2023", description: "Restaurant", category: "Dining", amount: -45.8 },
                  { date: "Apr 28, 2023", description: "Gas Station", category: "Transportation", amount: -38.5 },
                  { date: "Apr 27, 2023", description: "Movie Tickets", category: "Entertainment", amount: -24.0 },
                  { date: "Apr 25, 2023", description: "Freelance Payment", category: "Income", amount: 350.0 },
                ].map((transaction, i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="p-4">{transaction.date}</td>
                    <td className="p-4">{transaction.description}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          transaction.category === "Income"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td className={`p-4 text-right ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span className="text-sm text-slate-500">Showing 8 of 24 transactions</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">
                Previous
              </button>
              <button className="px-3 py-1 border rounded-md bg-[#6C16C7] text-white">1</button>
              <button className="px-3 py-1 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">2</button>
              <button className="px-3 py-1 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">3</button>
              <button className="px-3 py-1 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-700">Next</button>
            </div>
          </div>
        </div>
      </div>
      <ChatBar />
    </>
  )
}
