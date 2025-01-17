'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  requestRoninWalletConnector,
  RoninWalletConnector,
  ConnectorError,
  ConnectorErrorType
} from '@sky-mavis/tanto-connect'

type LoginModalProps = {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignup: () => void
  onSwitchToForgotPassword: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToSignup, onSwitchToForgotPassword }: LoginModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  })
  const [connector, setConnector] = useState<RoninWalletConnector | null>(null)
  const [roninAddress, setRoninAddress] = useState("")
  const [roninError, setRoninError] = useState("")

  const router = useRouter()

  const handleLoginInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setLoginUser((prevInfo) => ({ ...prevInfo, [name]: value }))
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!loginUser.email || !loginUser.password) {
        throw new Error("Please fill all the fields")
      }

      const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      if (!emailRegex.test(loginUser.email)) {
        throw new Error("Please enter a valid email address")
      }

      const res = await signIn("credentials", {
        email: loginUser.email,
        password: loginUser.password,
        redirect: false,
      })

      if (res?.error) {
        console.error("Login error:", res.error);
        throw new Error("Invalid email or password")
      }

      if (res?.ok) {
        router.push('/Dashboard')
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await signIn("google", { callbackUrl: "/Dashboard" })
      if (res?.error) {
        throw new Error(res.error)
      }
    } catch (error) {
      console.error("Google login error:", error)
      setError(error instanceof Error ? error.message : "An error occurred during Google login")
    } finally {
      setLoading(false)
    }
  }

  const handleRoninLogin = async () => {
    setLoading(true)
    setError("")
    setRoninError("")

    try {
      if (!connector) {
        const newConnector = await requestRoninWalletConnector()
        setConnector(newConnector)
      }

      const connectResult = await connector?.connect()

      if (connectResult) {
        setRoninAddress(connectResult.account)
        const res = await signIn("ronin-wallet", {
          address: connectResult.account,
          redirect: false,
        })

        if (res?.error) {
          if (res.error === "CredentialsSignin") {
            throw new Error("Failed to authenticate with Ronin Wallet. Please try again.")
          }
          throw new Error(res.error)
        }

        if (res?.ok) {
          router.push('/Dashboard')
        }
      } else {
        throw new Error("Failed to connect to Ronin Wallet")
      }
    } catch (error) {
      console.error("Ronin login error:", error)
      if (error instanceof ConnectorError && error.name === ConnectorErrorType.PROVIDER_NOT_FOUND) {
        window.open('https://wallet.roninchain.com', '_blank')
      } else {
        setRoninError(error instanceof Error ? error.message : "An error occurred during Ronin Wallet login")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
      <Card className="w-[400px] max-w-[90%] shadow-2xl bg-background border-orange-200">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
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
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={loginUser.email}
                onChange={handleLoginInputChange}
                placeholder="example@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={loginUser.password}
                onChange={handleLoginInputChange}
                placeholder="********"
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
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
          <div className="flex justify-end">
            <Button
              variant="link"
              className="p-0 h-auto text-sm font-normal text-orange-500 hover:underline"
              onClick={onSwitchToForgotPassword}
            >
              Forgot Password?
            </Button>
          </div>
          <div className="flex space-x-4 w-full">
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
              <img src="/images/gmail-logo.png" alt="Gmail" className="mr-1 h-6 w-6" />
              Gmail
            </Button>
            <Button variant="outline" className="w-full" onClick={handleRoninLogin} disabled={loading}>
              <img src="/images/ronin-wallet-logo.png" alt="Ronin Wallet" className="mr-2 h-4 w-4" />
              Ronin Wallet
            </Button>
          </div>
          {roninError && <p className="text-destructive text-sm">{roninError}</p>}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button variant="link" onClick={onSwitchToSignup} className="p-0 h-auto font-normal">
              Create one
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

