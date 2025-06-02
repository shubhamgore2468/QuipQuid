"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";

// Define TypeScript interfaces for the data structure
interface OverviewData {
  totalBalance: number;
  totalBalanceChange: number;
  monthlyIncome: number;
  monthlyIncomeChange: number;
  monthlySpending: number;
  monthlySpendingChange: number;
  savingsRate: number;
  savingsRateChange: number;
}

interface SpendingCategory {
  label: string;
  percentage: number;
  color: string;
}

interface Transaction {
  name: string;
  amount: number;
  date: string;
  category: string;
}

interface Account {
  name: string;
  balance: number;
  icon: React.ReactNode;
}

interface Bill {
  name: string;
  amount: number;
  date: string;
  status: string;
}

interface BudgetData {
  spent: number;
  total: number;
  percentage: number;
  month: string;
  year: string;
}

interface FinancialDataProps {
  overview: OverviewData;
  spendingCategories: SpendingCategory[];
  recentTransactions: Transaction[];
  accounts: Account[];
  upcomingBills: Bill[];
  monthlyBudget: BudgetData;
}

// Define the component props type
interface FinancialGraphsProps {
  financialData: FinancialDataProps;
}

// This is a functional component (not a class), which avoids the "Super expression" error
const FinancialGraphs: React.FC<FinancialGraphsProps> = ({ financialData }) => {
  // Generate monthly income/spending data for the line chart
  const generateMonthlyData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    // Using the values from financialData to set a baseline
    const baseIncome = financialData.overview.monthlyIncome;
    const baseSpending = financialData.overview.monthlySpending;

    return months.map((month, index) => {
      // Create some variation in the data for visualization purposes
      const income = baseIncome * (0.9 + Math.random() * 0.2);
      const spending = baseSpending * (0.85 + Math.random() * 0.3);
      const savings = income - spending;

      return {
        name: month,
        income: Math.round(income),
        spending: Math.round(spending),
        savings: Math.round(savings),
      };
    });
  };

  // Generate quarterly data for area chart
  const generateQuarterlyData = () => {
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    const baseBalance = financialData.overview.totalBalance;

    return quarters.map((quarter, index) => {
      // Create a growth trend
      const balance = baseBalance * (1 + index * 0.08);
      return {
        name: quarter,
        balance: Math.round(balance),
      };
    });
  };

  // Monthly data for income/expense chart
  const monthlyData = generateMonthlyData();

  // Quarterly data for balance growth
  const quarterlyData = generateQuarterlyData();

  // COLORS
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="financial-graphs">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Income vs Spending Line Chart */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Income vs Spending Trends
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#00C49F"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="spending"
                  stroke="#FF8042"
                  strokeWidth={2}
                  name="Spending"
                />
                <Line
                  type="monotone"
                  dataKey="savings"
                  stroke="#0088FE"
                  strokeWidth={2}
                  name="Savings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Spending Categories Pie Chart */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Spending Breakdown</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={financialData.spendingCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="percentage"
                  nameKey="label"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {financialData.spendingCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Balances Bar Chart */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Account Balances</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialData.accounts.map((account) => ({
                  name: account.name,
                  balance: account.balance,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    `$${Math.abs(parseFloat(value.toString())).toFixed(2)}`
                  }
                />
                <Bar dataKey="balance" fill="#8884d8">
                  {financialData.accounts.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        financialData.accounts[index].balance >= 0
                          ? "#00C49F"
                          : "#FF8042"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Balance Growth Area Chart */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Balance Growth</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={quarterlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#0088FE"
                  fill="#0088FE"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinancialGraphs;
