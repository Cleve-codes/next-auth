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
import { Checkbox } from "@/components/ui/checkbox"
import { Check, X } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  const validatePassword = (pwd: string) => {
    setPasswordStrength({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[@$!%*?&]/.test(pwd)
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirm-password')
      }

      if (!data.email || !data.password || !data.confirmPassword) {
        toast.error('Please fill in all required fields')
        setIsLoading(false)
        return
      }

      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Account created successfully! Redirecting to login...')
        router.push('/login')
      } else {
        // Check for specific error messages
        if (result.message?.toLowerCase().includes('user already exists')) {
          toast.error(result.message)
        } else if (result.message?.toLowerCase().includes('password must be')) {
          toast.error(result.message)
        } else {
          toast.error('Failed to create account. Please try again.')
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred while creating your account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Create an account</h1>
            <p className="text-gray-400">Enter your information to get started</p>
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
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  required
                  type="password"
                  className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-400 focus-visible:ring-gray-700"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    validatePassword(e.target.value)
                  }}
                />
                <div className="mt-2 space-y-1 text-sm">
                  <div className={`flex items-center gap-2 ${passwordStrength.length ? 'text-green-400' : 'text-red-400'}`}>
                    {passwordStrength.length ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.uppercase ? 'text-green-400' : 'text-red-400'}`}>
                    {passwordStrength.uppercase ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>At least one uppercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.lowercase ? 'text-green-400' : 'text-red-400'}`}>
                    {passwordStrength.lowercase ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>At least one lowercase letter</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.number ? 'text-green-400' : 'text-red-400'}`}>
                    {passwordStrength.number ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>At least one number</span>
                  </div>
                  <div className={`flex items-center gap-2 ${passwordStrength.special ? 'text-green-400' : 'text-red-400'}`}>
                    {passwordStrength.special ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>At least one special character (@$!%*?&)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  required
                  type="password"
                  className="border-gray-800 bg-gray-950 text-white placeholder:text-gray-400 focus-visible:ring-gray-700"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isLoading || !Object.values(passwordStrength).every(Boolean)}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-white hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
