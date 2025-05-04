import { ChatBar } from "@/components/chat-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingDown, TrendingUp, ArrowUpRight, PiggyBank, CreditCard, Wallet } from "lucide-react"

export default function DashboardPage() {
  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 opacity-90">Your complete financial overview</p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">$5,240</span>
                </div>
                <div className="flex items-center text-emerald-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">$3,580</span>
                </div>
                <div className="flex items-center text-emerald-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">$1,890</span>
                </div>
                <div className="flex items-center text-rose-500">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">-4%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <PiggyBank className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">32%</span>
                </div>
                <div className="flex items-center text-emerald-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spending Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Spending Categories</CardTitle>
                <CardDescription>Your spending breakdown for this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <CategoryBar label="Housing" percentage={35} color="bg-[#6C16C7]" />
                  <CategoryBar label="Food" percentage={25} color="bg-[#9747FF]" />
                  <CategoryBar label="Transportation" percentage={15} color="bg-[#B47EFF]" />
                  <CategoryBar label="Entertainment" percentage={10} color="bg-[#D2B1FF]" />
                  <CategoryBar label="Other" percentage={15} color="bg-[#E5D4FF]" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest financial activity</CardDescription>
                </div>
                <button className="text-sm text-primary font-medium flex items-center">
                  View all
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Grocery Store", amount: -82.45, date: "Today", category: "Food" },
                    { name: "Salary Deposit", amount: 2450.0, date: "Yesterday", category: "Income" },
                    { name: "Electric Bill", amount: -94.2, date: "May 2", category: "Utilities" },
                    { name: "Online Shopping", amount: -65.99, date: "May 1", category: "Shopping" },
                    { name: "Restaurant", amount: -45.8, date: "Apr 30", category: "Dining" },
                  ].map((transaction, i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3">
                          {transaction.amount > 0 ? (
                            <TrendingUp className="h-5 w-5 text-green-500" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-rose-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700">
                          {transaction.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Account Balances */}
            <Card>
              <CardHeader>
                <CardTitle>Account Balances</CardTitle>
                <CardDescription>Your linked accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Main Checking", balance: 2340.65, icon: <Wallet className="h-5 w-5" /> },
                  { name: "Savings Account", balance: 1850.0, icon: <PiggyBank className="h-5 w-5" /> },
                  { name: "Credit Card", balance: -950.45, icon: <CreditCard className="h-5 w-5" /> },
                ].map((account, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3 text-[#6C16C7]">
                        {account.icon}
                      </div>
                      <span className="font-medium">{account.name}</span>
                    </div>
                    <span className={account.balance < 0 ? "text-red-600" : ""}>
                      ${Math.abs(account.balance).toFixed(2)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Bills */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bills</CardTitle>
                <CardDescription>Due in the next 14 days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Rent", amount: 1200, date: "May 5", status: "Upcoming" },
                  { name: "Internet", amount: 79.99, date: "May 8", status: "Upcoming" },
                  { name: "Phone Bill", amount: 45.0, date: "May 12", status: "Upcoming" },
                ].map((bill, i) => (
                  <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{bill.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Due: {bill.date}</p>
                    </div>
                    <div className="text-right">
                      <p>${bill.amount.toFixed(2)}</p>
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Monthly Budget Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Budget</CardTitle>
                <CardDescription>Progress for May 2023</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Spent</span>
                    <span className="text-sm font-medium">$1,890 / $3,000</span>
                  </div>
                  <Progress value={63} className="h-2" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">You've spent 63% of your monthly budget</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <ChatBar />
    </>
  )
}

interface CategoryBarProps {
  label: string
  percentage: number
  color: string
}

function CategoryBar({ label, percentage, color }: CategoryBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
