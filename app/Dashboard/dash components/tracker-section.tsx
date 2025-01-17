"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Trash2, MoreHorizontal, RefreshCcw, ThumbsUp, ThumbsDown, Clipboard, ArrowUp, Bot, PenBox, ChevronDown } from 'lucide-react'
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'
import { DataTableDemo } from "./data-table-demo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { FaArrowUp, FaArrowDown, FaEquals, FaPercent } from 'react-icons/fa'
import Link from "next/link"
import Image from "next/image"
import { Separator } from "@radix-ui/react-separator"
import axios from 'axios'

type StatKey = 'managerSLP' | 'todaysManagerSLP' | 'managerTotalSLP' | 'scholarSLP' | 'todaysScholarSLP' | 'scholarTotalSLP'

type Stat = {
  label: string
  value: number
  isIncreasing: boolean
  logo: string | JSX.Element
  logoWidth: number
  logoHeight: number
}

export default function TrackerSection() {
  const [stats, setStats] = useState<Record<StatKey, Stat>>({
    managerSLP: { label: "Manager SLP", value: 0, isIncreasing: true, logo: "/images/SLP-logo.png", logoWidth: 30, logoHeight: 30 },
    todaysManagerSLP: { label: "Today's Manager SLP", value: 0, isIncreasing: false, logo: "/images/SLP-logo.png", logoWidth: 30, logoHeight: 30 },
    managerTotalSLP: { label: "Manager Total SLP", value: 0, isIncreasing: true, logo: <FaEquals className="w-8 h-8 text-blue-500" />, logoWidth: 35, logoHeight: 35 },
    scholarSLP: { label: "Scholar SLP", value: 0, isIncreasing: true, logo: "/images/SLP-logo.png", logoWidth: 30, logoHeight: 30 },
    todaysScholarSLP: { label: "Today's Scholar SLP", value: 0, isIncreasing: false, logo: "/images/SLP-logo.png", logoWidth: 30, logoHeight: 30 },
    scholarTotalSLP: { label: "Scholars Total SLP", value: 0, isIncreasing: true, logo: <FaEquals className="w-8 h-8 text-blue-500" />, logoWidth: 35, logoHeight: 35 },
  })

  useEffect(() => {
    fetchSLPDistribution()
    const interval = setInterval(fetchSLPDistribution, 60000) // Fetch every minute
    return () => clearInterval(interval)
  }, [])

  const fetchSLPDistribution = async () => {
    try {
      const response = await axios.get('/api/slp-distribution')
      const data = response.data

      setStats(prevStats => ({
        ...prevStats,
        managerSLP: { ...prevStats.managerSLP, value: 0 },
        todaysManagerSLP: { ...prevStats.todaysManagerSLP, value: data.managerTotalSLP },
        managerTotalSLP: { ...prevStats.managerTotalSLP, value: data.managerTotalSLP },
        scholarSLP: { ...prevStats.scholarSLP, value: 0 },
        todaysScholarSLP: { ...prevStats.todaysScholarSLP, value: data.scholarTotalSLP },
        scholarTotalSLP: { ...prevStats.scholarTotalSLP, value: data.scholarTotalSLP },
      }))
    } catch (error) {
      console.error('Error fetching SLP distribution:', error)
    }
  }

  return (
    <>
      <section className="flex justify-between items-center p-8 bg-[#64699c]">
        <div className="grid grid-cols-3 gap-8 w-full">
          {(Object.keys(stats) as StatKey[]).map((key) => (
            <div key={key} className="flex flex-col bg-[#fafafa] text-black p-2 rounded-md drop-shadow-[0_2px_0px_white]">
              <span className="text-left text-sm">{stats[key].label}</span>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold">{stats[key].value?.toLocaleString() ?? 'N/A'}</span>
                </div>
                <div className="flex items-center" style={{ width: `${stats[key].logoWidth}px`, height: `${stats[key].logoHeight}px`, marginLeft: 'auto' }}>
                  {typeof stats[key].logo === 'string' ? (
                    <img
                      src={stats[key].logo}
                      alt={`${stats[key].label} logo`}
                      className="object-contain"
                    />
                  ) : (
                    stats[key].logo
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="flex justify-between items-center p-8 bg-[#d2d3db]">
        <div className="w-full h-full">
          <h1 className="text-2xl font-bold">Scholars Table</h1>
          <p className="">More information of scholars are displayed here.</p>
           <DataTableDemo/>
        </div>
      </section>
    </>
  )
}

