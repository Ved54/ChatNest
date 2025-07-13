const express = require('express');
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const auth = require('../middleware/auth');

const router = express.Router();

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { chatRoomId, message } = req.body;

    // Check if chat room exists and user is participant
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (!chatRoom.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create message
    const newMessage = new Message({
      chatRoomId,
      sender: req.userId,
      message
    });

    await newMessage.save();
    await newMessage.populate('sender', 'username email avatar');

    // Update chat room last message and activity
    chatRoom.lastMessage = newMessage._id;
    chatRoom.lastActivity = new Date();
    await chatRoom.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Add user to readByRecipients if not already there
    if (!message.readByRecipients.includes(req.userId)) {
      message.readByRecipients.push(req.userId);
      await message.save();
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
