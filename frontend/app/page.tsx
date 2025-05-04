import { GoalsSection } from "@/components/goals-section"
import { FloatingChatBar } from "@/components/floating-chat-bar"

export default function Home() {
  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6">
          <GoalsSection />
        </div>
      </div>
      <FloatingChatBar />
    </>
  )
}
