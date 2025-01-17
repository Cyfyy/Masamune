import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/LandingPage/ThemeProvider'
import AuthProvider from '@/components/Provider/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Masamune - Axie Infinity Origins Tracker',
  description: 'Track your Axie Infinity Origins progress with Masamune',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

