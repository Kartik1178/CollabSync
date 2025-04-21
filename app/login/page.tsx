// pages/login.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include" // important for cookies
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Login failed")
      }
      toast({ title: "Login successful", description: "Welcome back!", })
      router.push("/dashboard")
    } catch (err) {
      toast({ title: "Login failed", description: err instanceof Error ? err.message : "Error", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0a0a0a]">
      <Card className="w-full max-w-md bg-[#121212] border border-[#2a2a2a]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold gradient-text">Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">{isLoading ? "Logging in..." : "Login"}</Button>
            <div className="mt-2 text-center text-sm text-gray-400">
              Don't have an account? <Link href="/register" className="text-primary hover:underline">Register</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

