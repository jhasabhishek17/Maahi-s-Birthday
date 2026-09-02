const mongoose = require('mongoose')

const giftRequestSchema = new mongoose.Schema({
  selectedGift:     { type: String, required: true, maxlength: 100, trim: true },
  selectedPlatform: { type: String, maxlength: 50, trim: true },
  optionalNote:     { type: String, maxlength: 500, trim: true },
  createdAt:        { type: Date, default: Date.now },
})

module.exports = mongoose.model('GiftRequest', giftRequestSchema)
