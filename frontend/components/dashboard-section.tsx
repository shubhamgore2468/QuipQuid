import { ArrowUpRight, DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Mini Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending Categories</CardTitle>
          <CardDescription>Your top spending categories this month</CardDescription>
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

      <div className="flex justify-end">
        <button className="flex items-center text-sm text-primary font-medium">
          View full dashboard
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
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
