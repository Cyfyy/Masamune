'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { signIn } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type SignupModalProps = {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function SignupModal({ isOpen, onClose, onSwitchToLogin }: SignupModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [signupUser, setSignupUser] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: ""
  })

  const router = useRouter()

  const handleSignupInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setSignupUser((prevInfo) => ({ ...prevInfo, [name]: value }))
  }

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!signupUser.email || !signupUser.name || !signupUser.password || !signupUser.confirmPassword) {
        throw new Error("Please fill all the fields")
      }

      const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      if (!emailRegex.test(signupUser.email)) {
        throw new Error("Please enter a valid email address")
      }

      if (signupUser.password !== signupUser.confirmPassword) {
        throw new Error("Passwords don't match")
      }

      if (signupUser.password.length < 8 || signupUser.password.length > 128) {
        throw new Error("Password must be between 8 and 128 characters long")
      }

      if (signupUser.password.match(/\s/)) {
        throw new Error("Password cannot contain spaces, tabs, or line breaks")
      }

      const res = await axios.post('/api/register', {
        email: signupUser.email,
        name: signupUser.name,
        password: signupUser.password
      })
      
      if (res.status === 200 || res.status === 201) {
        console.log("User created successfully")
        
        // Sign in the user immediately after successful signup
        const result = await signIn('credentials', {
          redirect: false,
          email: signupUser.email,
          password: signupUser.password,
        })

        if (result?.error) {
          throw new Error(result.error)
        }

        router.push('/Dashboard')
      }
    } catch (error) {
      console.error("Signup error:", error)
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || "An error occurred during signup")
      } else {
        setError(error instanceof Error ? error.message : "An error occurred during signup")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await signIn('google', { callbackUrl: '/Dashboard' })
      if (result?.error) {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Google signup error:", error)
      setError(error instanceof Error ? error.message : "An error occurred during Google signup")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
      <Card className="w-[400px] max-w-[90%] shadow-2xl bg-background border-orange-200">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={signupUser.name}
                  onChange={handleSignupInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={signupUser.email}
                  onChange={handleSignupInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={signupUser.password}
                  onChange={handleSignupInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={signupUser.confirmPassword}
                  onChange={handleSignupInputChange}
                />
              </div>
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Use</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading || !acceptTerms}
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <div className="flex space-x-4 w-full">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={loading}>
              <img src="/images/gmail-logo.png" alt="Gmail" className="mr-1 h-6 w-6" />
              Gmail
            </Button>
            <Button variant="outline" className="w-full">
              <img src="/images/ronin-wallet-logo.png" alt="Ronin Wallet" className="mr-2 h-4 w-4" />
              Ronin Wallet
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" onClick={onSwitchToLogin} className="p-0 h-auto font-normal">
              Log In
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

