import mongoose from 'mongoose'

const scholarDistributionSchema = new mongoose.Schema({
  scholarId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholar' },
  totalSLP: { type: Number, default: 0 },
  managerSLP: { type: Number, default: 0 },
  scholarSLP: { type: Number, default: 0 }
})

const slpDistributionSchema = new mongoose.Schema({
  totalSLP: { type: Number, default: 0 },
  managerTotalSLP: { type: Number, default: 0 },
  scholarTotalSLP: { type: Number, default: 0 },
  scholars: [scholarDistributionSchema],
  lastUpdated: { type: Date, default: Date.now }
})

const SLPDistribution = mongoose.models.SLPDistribution || mongoose.model('SLPDistribution', slpDistributionSchema)

export default SLPDistribution

