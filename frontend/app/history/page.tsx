import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function HistoryPage() {
  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Transaction History</h1>
          <p className="mt-2 opacity-90">View and manage your financial transactions</p>
        </div>

        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2">
              <select className="p-2 px-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Categories</option>
                <option>Income</option>
                <option>Expenses</option>
                <option>Transfers</option>
              </select>
              <select className="p-2 px-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500">
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
                className="w-full p-2 pl-10 pr-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-50 dark:bg-purple-900/10">
                <tr>
                  <th className="text-left p-4 text-purple-700 dark:text-purple-300">Date</th>
                  <th className="text-left p-4 text-purple-700 dark:text-purple-300">Description</th>
                  <th className="text-left p-4 text-purple-700 dark:text-purple-300">Category</th>
                  <th className="text-right p-4 text-purple-700 dark:text-purple-300">Amount</th>
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
                        className={`px-3 py-1 rounded-full text-xs ${
                          transaction.category === "Income"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
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
              <button className="px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                Previous
              </button>
              <button className="px-3 py-1 rounded-full bg-[#6C16C7] text-white">1</button>
              <button className="px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                2
              </button>
              <button className="px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                3
              </button>
              <button className="px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                Next
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
