import { NextResponse } from 'next/server'
import dbConnect from '@/utils/config/connect'
import SLPDistribution from '@/utils/models/SLPDestribution'
import Scholar from '@/utils/models/scholars'
import mongoose from 'mongoose';

export async function GET() {
  await dbConnect()

  try {
    let slpDistribution = await SLPDistribution.findOne()

    if (!slpDistribution) {
      slpDistribution = new SLPDistribution()
      await slpDistribution.save()
    }

    return NextResponse.json(slpDistribution)
  } catch (error) {
    console.error('Error fetching SLP distribution:', error)
    return NextResponse.json({ error: 'Error fetching SLP distribution' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  await dbConnect()

  try {
    const { scholarId, scholarTotalSLP, managerShare, scholarShare } = await request.json()

    let slpDistribution = await SLPDistribution.findOne()

    if (!slpDistribution) {
      slpDistribution = new SLPDistribution()
    }

    const managerSLP = Math.floor(scholarTotalSLP * (managerShare / 100))
    const scholarSLP = scholarTotalSLP - managerSLP

    // Update or create scholar-specific SLP distribution
    let scholarDistribution = slpDistribution.scholars.find((s: { scholarId: mongoose.Types.ObjectId }) => s.scholarId.toString() === scholarId)
    if (scholarDistribution) {
      scholarDistribution.totalSLP = scholarTotalSLP
      scholarDistribution.managerSLP = managerSLP
      scholarDistribution.scholarSLP = scholarSLP
    } else {
      slpDistribution.scholars.push({
        scholarId,
        totalSLP: scholarTotalSLP,
        managerSLP,
        scholarSLP
      })
    }

    // Update total SLP distribution
    slpDistribution.totalSLP = slpDistribution.scholars.reduce((sum: number, s: { totalSLP: number }) => sum + s.totalSLP, 0)
    slpDistribution.managerTotalSLP = slpDistribution.scholars.reduce((sum: number, s: { managerSLP: number }) => sum + s.managerSLP, 0)
    slpDistribution.scholarTotalSLP = slpDistribution.scholars.reduce((sum: number, s: { scholarSLP: number }) => sum + s.scholarSLP, 0)

    slpDistribution.lastUpdated = new Date()

    await slpDistribution.save()

    // Update scholar's totalSLP
    await Scholar.findByIdAndUpdate(scholarId, { totalSLP: scholarTotalSLP })

    console.log('Updated SLP Distribution:', slpDistribution)

    return NextResponse.json(slpDistribution)
  } catch (error) {
    console.error('Error updating SLP distribution:', error)
    return NextResponse.json({ error: 'Error updating SLP distribution' }, { status: 500 })
  }
}

