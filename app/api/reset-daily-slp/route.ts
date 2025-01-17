import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/utils/config/connect'
import SLPDistribution from '@/utils/models/SLPDestribution'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await dbConnect()

    try {
      let slpDistribution = await SLPDistribution.findOne()

      if (!slpDistribution) {
        slpDistribution = new SLPDistribution()
      }

      // Add today's values to the total
      slpDistribution.managerSLP += slpDistribution.todaysManagerSLP
      slpDistribution.scholarSLP += slpDistribution.todaysScholarSLP

      // Reset today's values
      slpDistribution.todaysManagerSLP = 0
      slpDistribution.todaysScholarSLP = 0

      // Update total values
      slpDistribution.managerTotalSLP = slpDistribution.managerSLP + slpDistribution.todaysManagerSLP
      slpDistribution.scholarTotalSLP = slpDistribution.scholarSLP + slpDistribution.todaysScholarSLP

      slpDistribution.lastUpdated = new Date()

      await slpDistribution.save()

      res.status(200).json({ message: 'Daily SLP reset successful' })
    } catch (error) {
      console.error('Error resetting daily SLP:', error)
      res.status(500).json({ error: 'Error resetting daily SLP' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

