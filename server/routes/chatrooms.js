const express = require('express');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all chat rooms for user
router.get('/', auth, async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find({
      participants: req.userId
    })
    .populate('participants', 'username email avatar status')
    .populate('lastMessage')
    .sort({ lastActivity: -1 });

    res.json(chatRooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new chat room
router.post('/', auth, async (req, res) => {
  try {
    const { name, participants, isGroupChat, admin } = req.body;

    // Check if one-on-one chat already exists
    if (!isGroupChat && participants.length === 2) {
      const existingChat = await ChatRoom.findOne({
        isGroupChat: false,
        participants: { $all: participants, $size: 2 }
      }).populate('participants', 'username email avatar status');

      if (existingChat) {
        return res.json(existingChat);
      }
    }

    const chatRoom = new ChatRoom({
      name,
      participants,
      isGroupChat,
      admin: isGroupChat ? admin : undefined
    });

    await chatRoom.save();
    await chatRoom.populate('participants', 'username email avatar status');

    res.status(201).json(chatRoom);
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a chat room
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const chatRoom = await ChatRoom.findById(req.params.id);
    
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Check if user is participant
    if (!chatRoom.participants.includes(req.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ chatRoomId: req.params.id })
      .populate('sender', 'username email avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
