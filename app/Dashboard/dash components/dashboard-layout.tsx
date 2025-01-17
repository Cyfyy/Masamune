'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { LineChart, User, Moon, Sun, LogOut, FileText, ChevronDown, ArrowLeftToLine, ArrowRightFromLine, Search, FolderKanban } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import TrackerSection from "@/app/Dashboard/dash components/tracker-section"
import { DashboardOverview } from "@/app/Dashboard/dash components/dashboard-overview"
import LogsSection from "@/app/Dashboard/dash components/logs-section"
import AppearanceSection from "@/app/Dashboard/dash components/appearance-section"
import AccountSection from "@/app/Dashboard/dash components/account-section"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Footer } from "@/components/LandingPage/Footer"

const navItems = [
  { name: "Overview", icon: FolderKanban, section: "overview" },
  { name: "Tracker", icon: LineChart, section: "tracker" },
]

const settingsItems = [
  { name: "My Account", icon: User, section: "account" },
  { name: "Appearance", icon: Moon, section: "appearance" },
  { name: "Logs", icon: FileText, section: "logs" },
]

export default function DashboardLayout() {
  const { data: session } = useSession()
  const [activeSection, setActiveSection] = useState("overview")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const section = searchParams?.get("section")
    if (section) {
      setActiveSection(section)
    }
  }, [searchParams])

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    router.replace(`?section=${section}`)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />
      case "tracker":
        return <TrackerSection />
      case "logs":
        return <LogsSection />
      case "account":
        return <AccountSection />
      case "appearance":
        return <AppearanceSection />
      default:
        return <DashboardOverview />
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"} flex h-screen`}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full ${collapsed ? "w-16" : "w-64"} ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} z-10 shadow-md transition-all duration-300`}
      >
        <Command>
          <div className="flex justify-center mt-1 mb-1">
            {!collapsed && (
              <Image
                src="/images/Masamune-Logo.png"
                alt="Masamune Logo"
                width={160}
                height={160}
                className="drop-shadow-[0_3px_2px_aqua]"
              />
            )}
            {collapsed && (
              <Image
                src="/images/M-logo.svg"
                alt="Masamune Logo"
                width={260}
                height={260}
                className="drop-shadow-[0_2px_1px_aqua]"
              />
            )}
          </div>
          <CommandList>
            <CommandGroup heading={!collapsed && "Dashboard"}>
              {navItems.map((item) => (
                <CommandItem
                  key={item.section}
                  onSelect={() => handleSectionChange(item.section)}
                  className={`relative flex items-center px-5 group cursor-pointer transition-all ${activeSection === item.section ? "bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-blue-200" : ""}`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-colors ${activeSection === item.section ? "fill-blue-300" : "fill-gray-100"
                      } group-hover:fill-blue-300`}
                  />
                  {!collapsed && <span className="ml-2">{item.name}</span>}
                  {collapsed && (
                    <div className="absolute left-16 top-0 z-20 w-auto px-2 py-1 text-sm bg-gray-800 text-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.name}
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            {!collapsed && <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />}
            {collapsed && <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 hidden" />}

            <CommandGroup heading={!collapsed && "Settings"}>
              {settingsItems.map((item) => (
                <CommandItem
                  key={item.section}
                  onSelect={() => handleSectionChange(item.section)}
                  className={`relative flex items-center px-5 group cursor-pointer transition-all ${activeSection === item.section ? "bg-blue-100 dark:bg-blue-600 text-blue-800 dark:text-blue-200" : ""}`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-colors ${activeSection === item.section ? "fill-blue-300" : "fill-gray-100"
                      } group-hover:fill-blue-300`}
                  />
                  {!collapsed && <span className="ml-2">{item.name}</span>}
                  {collapsed && (
                    <div className="absolute left-16 top-0 z-20 w-auto px-2 py-1 text-sm bg-gray-800 text-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.name}
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="mt-auto mb-4 px-5 flex items-center justify-between">
            {collapsed ? (
              <ArrowRightFromLine
                className="h-4 w-4 cursor-pointer ml-1"
                onClick={() => setCollapsed(false)}
              />
            ) : (
              <ArrowLeftToLine
                className="h-4 w-4 cursor-pointer"
                onClick={() => setCollapsed(true)}
              />
            )}
          </div>
        </Command>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${collapsed ? "ml-16" : "ml-64"} transition-all duration-300`}>
        {/* Header */}
        <header
          className={`fixed top-0 ${collapsed ? "left-16" : "left-64"} right-0 z-10 flex items-center justify-end ${theme === "dark" ? "bg-gray-800" : "bg-white"} p-3 shadow-md`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center text-sm bg-gray-200 rounded-full px-4 py-1 shadow-sm shadow-gray-500 hover:bg-gray-300 cursor-pointer">
                <span className="font-semibold mr-2 capitalize text-[13px]">{session?.user?.name || "User"}</span>
                <ChevronDown className="h-5 w-5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`w-56 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-lg shadow-lg transition-all`}
              align="end"
            >
              <div className="flex flex-col items-center justify-center gap-2 py-3">
                {/* Welcome Message */}
                <div className="flex items-center justify-center text-sm mb-3">
                  <span className="font-bold text-[14px] text-orange-500">Welcome, {session?.user?.name} 🎉</span>
                </div>

                <Separator className="h-[1px] w-full bg-gray-400" />

                {/* Mode Toggle & Logout Options */}
                <div className="flex flex-col items-center gap-2 mt-3">
                  {/* Dark/Light Mode Toggle */}
                  <DropdownMenuItem
                    className="flex justify-between items-center w-full px-4 py-2 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    <div className="flex items-center text-sm">
                      {theme === "dark" ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Moon className="mr-2 h-4 w-4" />
                      )}
                      {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </div>
                  </DropdownMenuItem>

                  {/* Logout Button */}
                  <DropdownMenuItem
                    className="flex justify-between items-center w-full px-4 py-2 rounded-md hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center text-sm">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </div>
                  </DropdownMenuItem>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>


        {/* Dynamic Content */}
        <main className="mt-[52px] bg-gray-200">
          {renderContent()}
          <Footer />
        </main>
      </div>
    </div>
  )
}
