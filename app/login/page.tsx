"use client"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string
    }

    if (!data.email || !data.password) {
      toast.error('Please fill in both email and password')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Login successful! Redirecting to dashboard...')
        router.push(`/thank-you?email=${encodeURIComponent(data.email)}`)
      } else {
        toast.error(result.message || 'Invalid email or password')
      }
    } catch (error) {
      toast.error('An error occurred while logging in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Welcome back</h1>
            <p className="text-gray-400">Enter your credentials to access your account</p>
          </div>
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-400 focus-visible:ring-gray-700"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  required
                  type="password"
                  className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-400 focus-visible:ring-gray-700"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Sign in'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <div className="relative flex items-center">
              <Separator className="bg-gray-800" />
            </div>
            <div className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-white hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
