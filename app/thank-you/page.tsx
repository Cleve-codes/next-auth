"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function ThankYouPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Get the email from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search)
    const email = urlParams.get('email')
    setUserEmail(email || null)
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        toast.success('Logged out successfully')
        router.push('/')
      } else {
        toast.error('Failed to log out')
      }
    } catch (error) {
      toast.error('An error occurred while logging out')
    }
  }

  if (!userEmail) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-black text-white">
        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-8 px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Welcome!</h1>
              <p className="mt-2 text-gray-400">
                You've been successfully logged in. Redirecting to the home page...
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md space-y-8 px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Welcome!</h1>
            <p className="mt-2 text-gray-400">
              You've been successfully logged in. Your email is: <b>{userEmail}</b>
            </p>
          </div>
          <Button
            onClick={handleLogout}
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            Logout
          </Button>
        </div>
      </main>
    </div>
  )
}