import { Metadata } from 'next'
import DashboardLayout from './dash components/dashboard-layout'

export const metadata: Metadata = {
  title: 'Masamune Dashboard',
  description: 'A powerful dashboard for managing your Masamune scholars and donations.',
}

export default function Home() {
  return (
    <main>
      <DashboardLayout />
    </main>
  )
}