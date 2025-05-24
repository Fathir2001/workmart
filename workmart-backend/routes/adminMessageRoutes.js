const express = require('express');
const router = express.Router();
const Message = require('../models/Contact'); // Using the Contact model since it's renamed to Messages
const { auth, verifyAdmin } = require('../middleware/auth');

// Get all messages with pagination
router.get('/', auth, verifyAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const total = await Message.countDocuments();
    const messages = await Message.find()
      .sort({ createdAt: -1 }) // Show newest first
      .skip(skip)
      .limit(limit);
    
    res.json({
      items: messages,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a message
router.delete('/:id', auth, verifyAdmin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    
    await message.deleteOne();
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;