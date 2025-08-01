import type React from "react"
import { ArrowUpRight, CheckCircle2, Circle, Target, Award, Flame, Star, Trophy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function GoalsSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-theme-navy dark:text-white">Streak</h2>

      {/* Rewards and Streaks Section */}
      <Card className="bg-gradient-to-r from-theme-navy50 to-theme-orange50 border-theme-navy/20 dark:border-theme-orange/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-theme-orange" />
            Rewards & Streaks
          </CardTitle>
          <CardDescription>Your achievements and current streaks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-theme-navy rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-theme-orange/20 dark:bg-theme-orange/30 mb-2">
                <Flame className="h-6 w-6 text-theme-orange" />
              </div>
              <span className="text-2xl font-bold text-theme-orange">14</span>
              <span className="text-xs text-theme-navy/70 dark:text-white/70">Day Streak</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-theme-navy rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-theme-orange/20 dark:bg-theme-orange/30 mb-2">
                <Star className="h-6 w-6 text-theme-orange" />
              </div>
              <span className="text-2xl font-bold text-theme-orange">320</span>
              <span className="text-xs text-theme-navy/70 dark:text-white/70">Points Earned</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto py-2 scrollbar-hide">
            <RewardBadge title="Budget Master" icon={<Award />} />
            <RewardBadge title="Saving Champion" icon={<Trophy />} />
            <RewardBadge title="Goal Crusher" icon={<Target />} />
            <RewardBadge title="2 Week Streak" icon={<Flame />} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
          <CardDescription>Track your progress towards financial freedom</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <GoalItem title="Emergency Fund" current={4500} target={6000} percentage={75} dueDate="Dec 2023" />

          <GoalItem title="New Car" current={3200} target={15000} percentage={21} dueDate="Jun 2024" />

          <GoalItem title="Vacation" current={1800} target={2500} percentage={72} dueDate="Aug 2023" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget</CardTitle>
          <CardDescription>This month's budget targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <BudgetGoalItem category="Groceries" spent={320} budget={400} isCompleted={false} />

          <BudgetGoalItem category="Dining Out" spent={150} budget={200} isCompleted={false} />

          <BudgetGoalItem category="Entertainment" spent={100} budget={100} isCompleted={true} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <button className="flex items-center text-sm text-theme-orange font-medium">
          View all goals
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

interface GoalItemProps {
  title: string
  current: number
  target: number
  percentage: number
  dueDate: string
}

function GoalItem({ title, current, target, percentage, dueDate }: GoalItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Target className="h-4 w-4 mr-2 text-theme-orange" />
          <span className="font-medium">{title}</span>
        </div>
        <span className="text-sm text-muted-foreground">Due: {dueDate}</span>
      </div>

      <Progress
        value={percentage}
        className="h-2"
        indicatorClassName={percentage > 50 ? "bg-theme-orange" : "bg-theme-orange/60"}
      />

      <div className="flex justify-between text-sm">
        <span>${current.toLocaleString()}</span>
        <span className="text-muted-foreground">${target.toLocaleString()}</span>
      </div>
    </div>
  )
}

interface BudgetGoalItemProps {
  category: string
  spent: number
  budget: number
  isCompleted: boolean
}

function BudgetGoalItem({ category, spent, budget, isCompleted }: BudgetGoalItemProps) {
  const percentage = Math.min(100, (spent / budget) * 100)
  const isNearLimit = spent > budget * 0.8 && spent <= budget
  const isOverBudget = spent > budget

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <div className="flex items-center">
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4 mr-2 text-theme-orange" />
          ) : (
            <Circle className="h-4 w-4 mr-2 text-muted-foreground" />
          )}
          <span className="font-medium">{category}</span>
        </div>
        <span className={`text-sm ${isOverBudget ? "text-theme-orange" : isNearLimit ? "text-theme-orangeLight" : ""}`}>
          ${spent} / ${budget}
        </span>
      </div>

      <Progress
        value={percentage}
        className={`h-2 ${
          spent > budget ? "bg-theme-orange/20" : spent > budget * 0.8 ? "bg-theme-orange/10" : "bg-theme-navy/10"
        }`}
        indicatorClassName={`${
          spent > budget ? "bg-theme-orange" : spent > budget * 0.8 ? "bg-theme-orangeLight" : "bg-theme-navy"
        }`}
      />
    </div>
  )
}

function RewardBadge({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center min-w-[80px] p-2 bg-white dark:bg-theme-navy rounded-lg border border-theme-navy/20 dark:border-theme-orange/20">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-theme-orange text-white mb-1">
        {icon}
      </div>
      <span className="text-xs text-center font-medium">{title}</span>
    </div>
  )
}
