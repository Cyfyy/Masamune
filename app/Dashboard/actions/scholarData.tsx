// saveScholarData.ts
import { MongoClient } from 'mongodb'

export type ScholarData = {
  firstName: string
  lastName: string
  axieId: string
  managerShare: number
  scholarShare: number
  battleLogs: any
}

export async function saveScholarData(scholarData: ScholarData) {
  const client = await MongoClient.connect(process.env.MONGODB_URI || '')
  const db = client.db()
  const collection = db.collection('scholars')

  const result = await collection.insertOne(scholarData)
  console.log('Scholar data saved:', result)
  await client.close()
}
