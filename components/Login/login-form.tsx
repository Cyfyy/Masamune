'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

type LoginFormProps = {
  setLoginEvent: 'set-login'
}

export function LoginForm({ setLoginEvent }: LoginFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  })

  const router = useRouter()

  useEffect(() => {
    const handleSetLogin = (e: CustomEvent) => {
      if (e.detail === false) {
        // Logic to switch to signup form
      }
    }

    window.addEventListener(setLoginEvent, handleSetLogin as EventListener)

    return () => {
      window.removeEventListener(setLoginEvent, handleSetLogin as EventListener)
    }
  }, [setLoginEvent])

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

      if (loginUser.password.length < 8 || loginUser.password.length > 128) {
        throw new Error("Password must be between 8 and 128 characters long")
      }

      const res = await signIn("credentials", {
        email: loginUser.email,
        password: loginUser.password,
        redirect: false,
      })
      
      if (res?.error) {
        throw new Error("Invalid email or password")
      }

      router.push('/Dashboard')
    } catch (error) {
      console.error(error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSetLogin = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(setLoginEvent, { detail: false }))
    }
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Login</h2>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            value={loginUser.email}
            onChange={handleLoginInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-500 dark:focus:border-orange-500" 
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            value={loginUser.password}
            onChange={handleLoginInputChange}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-500 dark:focus:border-orange-500" 
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      <div className="mt-4 flex justify-center space-x-4">
        <button className="flex items-center justify-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
          <Image src="/images/gmail-logo.png" alt="Gmail" width={25} height={20} className="mr-2" />
          Gmail
        </button>
        <button className="flex items-center justify-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50">
          <Image src="/images/ronin-wallet-logo.png" alt="Ronin Wallet" width={20} height={20} className="mr-2" />
          Ronin Wallet
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <button onClick={handleSetLogin} className="text-orange-500 hover:text-orange-600 font-medium">
          Create one
        </button>
      </p>
    </>
  )
}