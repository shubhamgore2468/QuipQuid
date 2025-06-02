"use client";

import { useState, useEffect } from "react";
import { PlusCircle, X, Receipt, ArrowLeft, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingChatBar } from "@/components/floating-chat-bar";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// Replace with your actual base URL
const BASE_URL = process.env.BACKEND_URL || "";

// Types for receipt data
interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptData {
  merchant_name: string;
  date: string;
  created_at: string;
  category: string;
  description: string;
  items: ReceiptItem[];
  total: number;
  // Add bill_id if your API returns one
  bill_id?: string;
}

// Types for food items with user assignments
interface FoodItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  users: User[];
}

interface User {
  id: number;
  name: string;
  initials: string;
  color: string;
}

// Request type for submitting split data
interface SplitSubmission {
  bill_id: string;
  merchant_name: string;
  split_items: SplitItem[];
}

interface SplitItem {
  item_id: number;
  item_name: string;
  price: number;
  user_ids: number[];
}

// Available users data with new color palette
const availableUsers = [
  { id: 1, name: "John Doe", initials: "JD", color: "#264653" },
  { id: 2, name: "Alice Smith", initials: "AS", color: "#2A9D8F" },
  { id: 3, name: "Bob Johnson", initials: "BJ", color: "#E9C46A" },
  { id: 4, name: "Emma Wilson", initials: "EW", color: "#F4A261" },
  { id: 5, name: "Mike Brown", initials: "MB", color: "#E76F51" },
];

export default function SplitPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [showUserSelector, setShowUserSelector] = useState<number | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billId, setBillId] = useState<string>("");

  // Load receipt data from localStorage on component mount
  useEffect(() => {
    const receiptDataString = localStorage.getItem("receiptData");

    if (receiptDataString) {
      try {
        const data = JSON.parse(receiptDataString) as ReceiptData;
        setReceiptData(data);

        // Generate a bill ID if none exists
        if (data.bill_id) {
          setBillId(data.bill_id);
        } else {
          // Generate a random bill ID if not provided by the API
          const randomBillId = `bill-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`;
          setBillId(randomBillId);
        }

        // Convert receipt items to food items format
        const convertedItems = data.items.map((item, index) => ({
          id: index + 1,
          name: item.name,
          price: item.price * item.quantity, // Total price for the item
          quantity: item.quantity,
          users: [],
        }));

        setFoodItems(convertedItems);

        // Remove from localStorage after retrieving
        localStorage.removeItem("receiptData");
      } catch (error) {
        console.error("Error parsing receipt data:", error);
      }
    }

    setIsLoading(false);
  }, []);

  const handleAddUser = (itemId: number, user: User) => {
    setFoodItems(
      foodItems.map((item) => {
        if (item.id === itemId) {
          // Check if user is already added
          if (!item.users.some((u) => u.id === user.id)) {
            return { ...item, users: [...item.users, user] };
          }
        }
        return item;
      })
    );
  };

  const handleRemoveUser = (itemId: number, userId: number) => {
    setFoodItems(
      foodItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            users: item.users.filter((user) => user.id !== userId),
          };
        }
        return item;
      })
    );
  };

  const toggleUserSelector = (itemId: number) => {
    setShowUserSelector(showUserSelector === itemId ? null : itemId);
  };

  // Calculate per-person cost for an item
  const getPerPersonCost = (item: FoodItem) => {
    if (item.users.length === 0) return 0;
    return item.price / item.users.length;
  };

  // Calculate total bill amount
  const getTotalBillAmount = () => {
    return foodItems.reduce((total, item) => total + item.price, 0);
  };

  // Calculate total per user
  const getTotalPerUser = (userId: number) => {
    let total = 0;
    foodItems.forEach((item) => {
      if (item.users.some((user) => user.id === userId)) {
        total += getPerPersonCost(item);
      }
    });
    return total;
  };

  // Go back to chat
  const handleBackToChat = () => {
    router.push("/chat");
  };

  // Submit split data to the backend
  const handleSubmitSplit = async () => {
    if (!receiptData) return;

    setIsSubmitting(true);

    try {
      // Prepare the split data
      const splitItems: SplitItem[] = foodItems.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        user_ids: item.users.map((user) => user.id),
      }));

      const submissionData: SplitSubmission = {
        bill_id: billId,
        merchant_name: receiptData.merchant_name,
        split_items: splitItems,
      };

      // Send the data to your backend API
      const response = await fetch(`${BASE_URL}/api/split-bill/split_item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();

      // Show success message
      toast({
        title: "Split saved successfully!",
        description: "Your split has been processed and saved.",
        variant: "default",
      });

      // Optionally redirect to a confirmation page
      // router.push(`/split-confirmation/${result.split_id}`);
    } catch (error) {
      console.error("Error submitting split:", error);

      // Show error message
      toast({
        title: "Error saving split",
        description:
          "There was a problem processing your split. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if we can submit the split (all items have at least one user assigned)
  const canSubmitSplit = () => {
    return foodItems.every((item) => item.users.length > 0);
  };

  // Show a loading state while data is being retrieved
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin mb-4 mx-auto">
            <Receipt size={48} className="text-coastal-teal" />
          </div>
          <p className="text-lg">Loading receipt data...</p>
        </div>
      </div>
    );
  }

  // Show a fallback message if no receipt data is found
  if (!receiptData && !isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="bg-coastal-teal/10 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">No Receipt Data Found</h2>
          <p className="mb-6">
            Please upload a receipt image in the chat to get started.
          </p>
          <button
            onClick={handleBackToChat}
            className="px-4 py-2 bg-coastal-teal text-white rounded-md hover:bg-coastal-teal/90"
          >
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 pb-20">
      <div className="bg-gradient-to-r from-coastal-dark to-coastal-teal rounded-lg p-6 mb-6 dark:text-white shadow-lg">
        <div className="flex items-center mb-2">
          <button
            onClick={handleBackToChat}
            className="mr-4 p-2 rounded-full hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold">Split the Bill</h1>
        </div>
        {receiptData && (
          <div className="mt-2 opacity-90">
            <p className="text-lg font-medium">{receiptData.merchant_name}</p>
            <p className="text-sm">
              {receiptData.date} • {receiptData.category} • $
              {receiptData.total.toFixed(2)}
            </p>
            <p className="text-sm">{receiptData.description}</p>
            <p className="text-xs mt-1 opacity-75">Bill ID: {billId}</p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receipt Items</CardTitle>
          <CardDescription>Select who's paying for each item</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {foodItems.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 relative ${
                  item.users.length === 0
                    ? "border-orange-300"
                    : "border-green-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-coastal-dark/60 dark:text-coastal-teal/60">
                      {item.quantity > 1 ? `${item.quantity}x ` : ""}$
                      {item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status indicator */}
                    {item.users.length > 0 ? (
                      <span className="text-green-500">
                        <CheckCircle size={16} />
                      </span>
                    ) : (
                      <span className="text-xs text-orange-500">
                        Needs assignment
                      </span>
                    )}

                    {/* User avatars */}
                    {item.users.length > 0 && (
                      <div className="flex -space-x-2 mr-2">
                        {item.users.map((user, index) => (
                          <div
                            key={user.id}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-coastal-dark relative group"
                            style={{
                              backgroundColor: user.color,
                              zIndex: item.users.length - index,
                            }}
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
                    <h4 className="font-medium text-sm mb-2">
                      Add people to split with:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {availableUsers.map((user) => {
                        const isAdded = item.users.some(
                          (u) => u.id === user.id
                        );
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
                        );
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
                const userTotal = getTotalPerUser(user.id);

                if (userTotal > 0) {
                  return (
                    <div
                      key={user.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.initials}
                        </div>
                        <span>{user.name}</span>
                      </div>
                      <span className="font-medium">
                        ${userTotal.toFixed(2)}
                      </span>
                    </div>
                  );
                }
                return null;
              })}

              {/* Total bill amount */}
              <div className="pt-3 mt-3 border-t border-coastal-teal/20 dark:border-coastal-teal/30">
                {/* <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Bill</span>
                  <span className="font-bold text-lg">
                    ${getTotalBillAmount().toFixed(2)}
                  </span>
                </div> */}
                {receiptData && (
                  <div className="flex justify-between items-center text-sm mt-1 text-coastal-dark/60 dark:text-coastal-teal/60">
                    <span>Receipt Total</span>
                    <span>${receiptData.total.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4 gap-3">
          <Button variant="outline" onClick={handleBackToChat}>
            Submit
          </Button>
          <Button
            onClick={handleSubmitSplit}
            disabled={!canSubmitSplit() || isSubmitting}
            className="bg-coastal-teal hover:bg-coastal-teal/90 text-white"
          >
            {isSubmitting ? "Processing..." : "Save Split"}
          </Button>
        </CardFooter>
      </Card>
      <FloatingChatBar />
    </div>
  );
}
