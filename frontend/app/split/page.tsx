"use client"

import { useState } from "react"
import { PlusCircle, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FloatingChatBar } from "@/components/floating-chat-bar"

// Mock food items data
const initialFoodItems = [
  { id: 1, name: "Margherita Pizza", price: 12.99, users: [] },
  { id: 2, name: "Caesar Salad", price: 8.5, users: [] },
  { id: 3, name: "Chicken Wings", price: 10.99, users: [] },
  { id: 4, name: "Garlic Bread", price: 4.99, users: [] },
  { id: 5, name: "Spaghetti Carbonara", price: 14.5, users: [] },
  { id: 6, name: "Tiramisu", price: 6.99, users: [] },
  { id: 7, name: "Soft Drinks", price: 2.5, users: [] },
]

// Mock users data with new color palette
const availableUsers = [
  { id: 1, name: "John Doe", initials: "JD", color: "#264653" },
  { id: 2, name: "Alice Smith", initials: "AS", color: "#2A9D8F" },
  { id: 3, name: "Bob Johnson", initials: "BJ", color: "#E9C46A" },
  { id: 4, name: "Emma Wilson", initials: "EW", color: "#F4A261" },
  { id: 5, name: "Mike Brown", initials: "MB", color: "#E76F51" },
]

interface FoodItem {
  id: number
  name: string
  price: number
  users: User[]
}

interface User {
  id: number
  name: string
  initials: string
  color: string
}

export default function SplitPage() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems)
  const [showUserSelector, setShowUserSelector] = useState<number | null>(null)

  const handleAddUser = (itemId: number, user: User) => {
    setFoodItems(
      foodItems.map((item) => {
        if (item.id === itemId) {
          // Check if user is already added
          if (!item.users.some((u) => u.id === user.id)) {
            return { ...item, users: [...item.users, user] }
          }
        }
        return item
      }),
    )
  }

  const handleRemoveUser = (itemId: number, userId: number) => {
    setFoodItems(
      foodItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, users: item.users.filter((user) => user.id !== userId) }
        }
        return item
      }),
    )
  }

  const toggleUserSelector = (itemId: number) => {
    setShowUserSelector(showUserSelector === itemId ? null : itemId)
  }

  // Calculate per-person cost for an item
  const getPerPersonCost = (item: FoodItem) => {
    if (item.users.length === 0) return 0
    return item.price / item.users.length
  }

  // Calculate total bill amount
  const getTotalBillAmount = () => {
    return foodItems.reduce((total, item) => total + item.price, 0)
  }

  // Calculate total per user
  const getTotalPerUser = (userId: number) => {
    let total = 0
    foodItems.forEach((item) => {
      if (item.users.some((user) => user.id === userId)) {
        total += getPerPersonCost(item)
      }
    })
    return total
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="bg-gradient-to-r from-coastal-dark to-coastal-teal rounded-lg p-6 mb-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Split the Bill</h1>
        <p className="mt-2 opacity-90">Divide food expenses among friends</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Food Items</CardTitle>
          <CardDescription>Select who's paying for each item</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {foodItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 relative">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-coastal-dark/60 dark:text-coastal-teal/60">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* User avatars */}
                    {item.users.length > 0 && (
                      <div className="flex -space-x-2 mr-2">
                        {item.users.map((user, index) => (
                          <div
                            key={user.id}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-coastal-dark relative group"
                            style={{ backgroundColor: user.color, zIndex: item.users.length - index }}
                          >
                            {user.initials}
                            <button
                              onClick={() => handleRemoveUser(item.id, user.id)}
                              className="absolute -top-1 -right-1 bg-coastal-coral text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-coastal-dark text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {user.name}
                              {item.users.length > 1 && (
                                <span className="block text-xs opacity-75">
                                  ${getPerPersonCost(item).toFixed(2)} each
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add user button */}
                    <button
                      onClick={() => toggleUserSelector(item.id)}
                      className="p-2 rounded-full bg-coastal-teal/10 dark:bg-coastal-teal/20 text-coastal-teal hover:bg-coastal-teal/20 dark:hover:bg-coastal-teal/30"
                    >
                      <PlusCircle size={20} />
                    </button>
                  </div>
                </div>

                {/* User selector dropdown */}
                {showUserSelector === item.id && (
                  <div className="mt-3 p-3 bg-white dark:bg-coastal-dark rounded-md shadow-md border border-coastal-teal/20 dark:border-coastal-teal/30">
                    <h4 className="font-medium text-sm mb-2">Add people to split with:</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableUsers.map((user) => {
                        const isAdded = item.users.some((u) => u.id === user.id)
                        return (
                          <button
                            key={user.id}
                            onClick={() => handleAddUser(item.id, user)}
                            disabled={isAdded}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                              isAdded
                                ? "bg-coastal-dark/10 text-coastal-dark/40 dark:bg-coastal-teal/10 dark:text-coastal-teal/40 cursor-not-allowed"
                                : "bg-coastal-teal/10 text-coastal-teal hover:bg-coastal-teal/20 dark:bg-coastal-teal/20 dark:hover:bg-coastal-teal/30"
                            }`}
                          >
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                              style={{ backgroundColor: user.color }}
                            >
                              {user.initials}
                            </div>
                            <span>{user.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-coastal-teal/10 dark:bg-coastal-teal/20 rounded-lg">
            <h3 className="font-medium mb-2">Summary</h3>
            <div className="space-y-2">
              {availableUsers.map((user) => {
                // Calculate total for this user
                const userTotal = getTotalPerUser(user.id)

                if (userTotal > 0) {
                  return (
                    <div key={user.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.initials}
                        </div>
                        <span>{user.name}</span>
                      </div>
                      <span className="font-medium">${userTotal.toFixed(2)}</span>
                    </div>
                  )
                }
                return null
              })}

              {/* Total bill amount */}
              <div className="pt-3 mt-3 border-t border-coastal-teal/20 dark:border-coastal-teal/30">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Bill</span>
                  <span className="font-bold text-lg">${getTotalBillAmount().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <FloatingChatBar />
    </div>
  )
}
