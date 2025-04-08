import type { ReactNode } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="w-full border-dashed border-[#2a2a2a] bg-[#121212]">
      <CardHeader className="flex flex-col items-center justify-center pt-10">
        <div className="p-3 rounded-full bg-[#1a1a1a]">{icon}</div>
        <CardTitle className="mt-4 text-xl gradient-text">{title}</CardTitle>
        <CardDescription className="text-center text-gray-400">{description}</CardDescription>
      </CardHeader>
      {action && <CardFooter className="flex justify-center pb-10">{action}</CardFooter>}
    </Card>
  )
}

