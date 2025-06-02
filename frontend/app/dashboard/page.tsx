import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  ArrowUpRight,
  PiggyBank,
  CreditCard,
  Wallet,
} from "lucide-react";
import { FloatingChatBar } from "@/components/floating-chat-bar";
import FinancialGraphs from "../../components/graphs";

// Central data dictionary for all financial values
const financialData = {
  overview: {
    totalBalance: 5240,
    totalBalanceChange: 12,
    monthlyIncome: 3580,
    monthlyIncomeChange: 5,
    monthlySpending: 1890,
    monthlySpendingChange: -4,
    savingsRate: 32,
    savingsRateChange: 2,
  },
  spendingCategories: [
    { label: "Housing", percentage: 35, color: "bg-coastal-dark" },
    { label: "Food", percentage: 25, color: "bg-coastal-teal" },
    { label: "Transportation", percentage: 15, color: "bg-coastal-gold" },
    { label: "Entertainment", percentage: 10, color: "bg-coastal-orange" },
    { label: "Other", percentage: 15, color: "bg-coastal-coral" },
  ],
  recentTransactions: [
    {
      name: "Grocery Store",
      amount: -82.45,
      date: "Today",
      category: "Food",
    },
    {
      name: "Salary Deposit",
      amount: 2450.0,
      date: "Yesterday",
      category: "Income",
    },
    {
      name: "Electric Bill",
      amount: -94.2,
      date: "May 2",
      category: "Utilities",
    },
    {
      name: "Online Shopping",
      amount: -65.99,
      date: "May 1",
      category: "Shopping",
    },
    {
      name: "Restaurant",
      amount: -45.8,
      date: "Apr 30",
      category: "Dining",
    },
  ],
  accounts: [
    {
      name: "Main Checking",
      balance: 2340.65,
      icon: <Wallet className="h-5 w-5" />,
    },
    {
      name: "Savings Account",
      balance: 1850.0,
      icon: <PiggyBank className="h-5 w-5" />,
    },
    {
      name: "Credit Card",
      balance: -950.45,
      icon: <CreditCard className="h-5 w-5" />,
    },
  ],
  upcomingBills: [
    {
      name: "Rent",
      amount: 1200,
      date: "May 5",
      status: "Upcoming",
    },
    {
      name: "Internet",
      amount: 79.99,
      date: "May 8",
      status: "Upcoming",
    },
    {
      name: "Phone Bill",
      amount: 45.0,
      date: "May 12",
      status: "Upcoming",
    },
  ],
  monthlyBudget: {
    spent: 1890,
    total: 3000,
    percentage: 63,
    month: "May",
    year: "2023",
  },
};

// Helper function to format currency
const formatCurrency = (value: any) => {
  return Math.abs(value).toFixed(2);
};

export default function DashboardPage() {
  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-gradient-to-r from-coastal-teal to-coastal-dark rounded-lg p-6 mb-6 dark:text-white shadow-lg">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 opacity-90">Your complete financial overview</p>
        </div>

        {/* Graphs Section */}
        <div className="mb-6">
          {/* <div className="bg-gradient-to-r from-coastal-teal to-coastal-dark rounded-lg p-6 mb-6 dark:text-white shadow-lg">
            <h1 className="text-3xl font-bold">Graphs</h1>
            <p className="mt-2 opacity-90">
              Visual representation of your finances
            </p>
          </div> */}

          {/* Pass the financial data dictionary to the graphs component */}
          <FinancialGraphs financialData={financialData} />
        </div>
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <OverviewCard
            title="Total Balance"
            value={financialData.overview.totalBalance}
            change={financialData.overview.totalBalanceChange}
            icon={<DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />}
          />

          <OverviewCard
            title="Monthly Income"
            value={financialData.overview.monthlyIncome}
            change={financialData.overview.monthlyIncomeChange}
            icon={<DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />}
          />

          <OverviewCard
            title="Monthly Spending"
            value={financialData.overview.monthlySpending}
            change={financialData.overview.monthlySpendingChange}
            icon={<DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />}
          />

          <OverviewCard
            title="Savings Rate"
            value={financialData.overview.savingsRate}
            change={financialData.overview.savingsRateChange}
            icon={<PiggyBank className="mr-2 h-4 w-4 text-muted-foreground" />}
            percentage={true}
          />
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Spending Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Spending Categories</CardTitle>
                <CardDescription>
                  Your spending breakdown for this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.spendingCategories.map((category, index) => (
                    <CategoryBar
                      key={index}
                      label={category.label}
                      percentage={category.percentage}
                      color={category.color}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest financial activity
                  </CardDescription>
                </div>
                <button className="text-sm text-coastal-teal font-medium flex items-center">
                  View all
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.recentTransactions.map((transaction, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-coastal-teal/10 dark:bg-coastal-teal/20 flex items-center justify-center mr-3">
                          {transaction.amount > 0 ? (
                            <TrendingUp className="h-5 w-5 text-coastal-teal" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-coastal-coral" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.name}</p>
                          <p className="text-xs text-coastal-dark/60 dark:text-coastal-teal/60">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={
                            transaction.amount > 0
                              ? "text-coastal-teal"
                              : "text-coastal-coral"
                          }
                        >
                          ${formatCurrency(transaction.amount)}
                        </p>
                        <span className="text-xs px-2 py-1 rounded-full bg-coastal-dark/10 dark:bg-coastal-teal/10">
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
                {financialData.accounts.map((account, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-coastal-teal/10 dark:bg-coastal-teal/20 flex items-center justify-center mr-3 text-coastal-teal">
                        {account.icon}
                      </div>
                      <span className="font-medium">{account.name}</span>
                    </div>
                    <span
                      className={
                        account.balance < 0 ? "text-coastal-coral" : ""
                      }
                    >
                      ${formatCurrency(account.balance)}
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
                {financialData.upcomingBills.map((bill, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{bill.name}</p>
                      <p className="text-xs text-coastal-dark/60 dark:text-coastal-teal/60">
                        Due: {bill.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>${formatCurrency(bill.amount)}</p>
                      <span className="text-xs px-2 py-1 bg-coastal-gold/20 text-coastal-gold/80 rounded-full">
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
                <CardDescription>
                  Progress for {financialData.monthlyBudget.month}{" "}
                  {financialData.monthlyBudget.year}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Spent</span>
                    <span className="text-sm font-medium">
                      ${formatCurrency(financialData.monthlyBudget.spent)} / $
                      {formatCurrency(financialData.monthlyBudget.total)}
                    </span>
                  </div>
                  <Progress
                    value={financialData.monthlyBudget.percentage}
                    className="h-2 bg-coastal-teal/20"
                    indicatorClassName="bg-coastal-teal"
                  />
                  <p className="text-xs text-coastal-dark/60 dark:text-coastal-teal/60">
                    You've spent {financialData.monthlyBudget.percentage}% of
                    your monthly budget
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <FloatingChatBar />
    </>
  );
}

interface OverviewCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  percentage?: boolean;
}

function OverviewCard({
  title,
  value,
  change,
  icon,
  percentage = false,
}: OverviewCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon}
            <span className="text-2xl font-bold">
              {percentage ? value + "%" : "$" + formatCurrency(value)}
            </span>
          </div>
          <div
            className={`flex items-center ${
              change >= 0 ? "text-coastal-teal" : "text-coastal-coral"
            }`}
          >
            {change >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm">
              {change >= 0 ? "+" : ""}
              {change}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CategoryBarProps {
  label: string;
  percentage: number;
  color: string;
}

function CategoryBar({ label, percentage, color }: CategoryBarProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <div className="h-2 bg-coastal-dark/10 dark:bg-coastal-teal/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
