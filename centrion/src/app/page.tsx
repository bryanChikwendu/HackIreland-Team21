"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  interface LoginFormEvent extends React.FormEvent<HTMLFormElement> {}

  const handleLogin = (e: LoginFormEvent): void => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate authentication - in a real app, this would be an API call
    setTimeout(() => {
      // Store auth state
      localStorage.setItem("centrion-auth", JSON.stringify({ isLoggedIn: true }))
      // Redirect to dashboard
      window.location.href = "/dashboard"
    }, 1000)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Shield className="w-12 h-12 text-blue-600" />
          <h1 className="text-2xl font-bold">Centrion Security</h1>
          <p className="text-sm text-slate-500">Context-aware surveillance system</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" placeholder="admin@centrion.io" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  )
}
