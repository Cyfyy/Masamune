import { ThemeProvider } from "next-themes"
import { Navbar } from "@/components/LandingPage/Navbar"
import { Hero } from "@/components/LandingPage/Hero"
import { Features } from "@/components/LandingPage/Features"
import { CallToAction } from "@/components/LandingPage/CallToAction"
import { Footer } from "@/components/LandingPage/Footer"

export default function LandingPage() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-orange-900">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}