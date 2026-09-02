let GiftRequest
try { GiftRequest = require('../models/GiftRequest') } catch {}

const giftOptions = {
  bouquets: ['Tulip Bouquet', 'Rose Bouquet', 'Sunflower Bouquet', 'Mixed Bouquet', 'Surprise Me'],
  gifts: ['Flowers', 'Teddy Bear', 'Something Sweet', 'Coffee', 'Food', 'Music', 'Books', 'Surprise Me'],
  platforms: ['Amazon', 'Flipkart', 'Meesho', 'Zepto', 'Swiggy'],
}

exports.getGiftOptions = (req, res) => {
  res.json({ success: true, data: giftOptions })
}

exports.submitGiftRequest = async (req, res) => {
  const { selectedGift, selectedPlatform, optionalNote } = req.body

  if (!selectedGift || typeof selectedGift !== 'string' || selectedGift.length > 100) {
    return res.status(400).json({ error: 'Invalid gift selection.' })
  }

  const safeNote = optionalNote && typeof optionalNote === 'string'
    ? optionalNote.slice(0, 500).replace(/<[^>]*>/g, '') : ''

  console.log(`🌷 Gift request: ${selectedGift} | Platform: ${selectedPlatform || 'none'} | Note: ${safeNote || 'none'}`)

  try {
    if (GiftRequest) {
      await GiftRequest.create({ selectedGift, selectedPlatform: selectedPlatform || '', optionalNote: safeNote })
    }
  } catch (e) {
    console.log('DB save skipped (no DB):', e.message)
  }

  res.json({ success: true, message: 'Request received! 🌷' })
}

exports.submitBirthdayMessage = async (req, res) => {
  const { message } = req.body
  if (!message || typeof message !== 'string' || message.length > 500) {
    return res.status(400).json({ error: 'Invalid message.' })
  }
  console.log('💌 Birthday message received.')
  res.json({ success: true, message: 'Message noted! 🧸' })
}
