const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      return this.isGroupChat;
    },
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 200
  },
  isGroupChat: {
    type: Boolean,
    default: false
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.isGroupChat;
    }
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ lastActivity: -1 });

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
