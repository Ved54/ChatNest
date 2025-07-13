require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await ChatRoom.deleteMany({});
    await Message.deleteMany({});

    // Create dummy users
    const users = [
      {
        username: 'alice',
        email: 'alice@example.com',
        password: '123456',
        avatar: '',
        status: 'online'
      },
      {
        username: 'bob',
        email: 'bob@example.com',
        password: '123456',
        avatar: '',
        status: 'online'
      },
      {
        username: 'charlie',
        email: 'charlie@example.com',
        password: '123456',
        avatar: '',
        status: 'offline'
      },
      {
        username: 'diana',
        email: 'diana@example.com',
        password: '123456',
        avatar: '',
        status: 'away'
      },
      {
        username: 'eve',
        email: 'eve@example.com',
        password: '123456',
        avatar: '',
        status: 'online'
      }
    ];

    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create chat rooms
    const chatRooms = [
      {
        name: 'General Chat',
        description: 'General discussion for everyone',
        isGroupChat: true,
        participants: [createdUsers[0]._id, createdUsers[1]._id, createdUsers[2]._id],
        admin: createdUsers[0]._id
      },
      {
        name: 'Project Team',
        description: 'Team discussion for the project',
        isGroupChat: true,
        participants: [createdUsers[0]._id, createdUsers[3]._id, createdUsers[4]._id],
        admin: createdUsers[0]._id
      },
      {
        // One-on-one chat between Alice and Bob
        isGroupChat: false,
        participants: [createdUsers[0]._id, createdUsers[1]._id]
      },
      {
        // One-on-one chat between Charlie and Diana
        isGroupChat: false,
        participants: [createdUsers[2]._id, createdUsers[3]._id]
      }
    ];

    const createdChatRooms = await ChatRoom.create(chatRooms);
    console.log(`Created ${createdChatRooms.length} chat rooms`);

    // Create some messages
    const messages = [
      {
        chatRoomId: createdChatRooms[0]._id,
        sender: createdUsers[0]._id,
        message: 'Hello everyone! Welcome to the general chat.',
        readByRecipients: [createdUsers[1]._id]
      },
      {
        chatRoomId: createdChatRooms[0]._id,
        sender: createdUsers[1]._id,
        message: 'Hi Alice! Thanks for setting this up.',
        readByRecipients: [createdUsers[0]._id, createdUsers[2]._id]
      },
      {
        chatRoomId: createdChatRooms[0]._id,
        sender: createdUsers[2]._id,
        message: 'Great to be here! Looking forward to our discussions.',
        readByRecipients: []
      },
      {
        chatRoomId: createdChatRooms[1]._id,
        sender: createdUsers[0]._id,
        message: 'Team, let\'s discuss our project milestones.',
        readByRecipients: [createdUsers[3]._id]
      },
      {
        chatRoomId: createdChatRooms[1]._id,
        sender: createdUsers[3]._id,
        message: 'I\'ve prepared the initial requirements document.',
        readByRecipients: [createdUsers[0]._id, createdUsers[4]._id]
      },
      {
        chatRoomId: createdChatRooms[2]._id,
        sender: createdUsers[0]._id,
        message: 'Hey Bob, how are you doing?',
        readByRecipients: [createdUsers[1]._id]
      },
      {
        chatRoomId: createdChatRooms[2]._id,
        sender: createdUsers[1]._id,
        message: 'I\'m doing well, thanks! How about you?',
        readByRecipients: [createdUsers[0]._id]
      },
      {
        chatRoomId: createdChatRooms[3]._id,
        sender: createdUsers[2]._id,
        message: 'Diana, are you available for a quick call?',
        readByRecipients: []
      }
    ];

    const createdMessages = await Message.create(messages);
    console.log(`Created ${createdMessages.length} messages`);

    // Update chat rooms with last messages
    for (let i = 0; i < createdChatRooms.length; i++) {
      const roomMessages = createdMessages.filter(msg => 
        msg.chatRoomId.toString() === createdChatRooms[i]._id.toString()
      );
      
      if (roomMessages.length > 0) {
        const lastMessage = roomMessages[roomMessages.length - 1];
        await ChatRoom.findByIdAndUpdate(createdChatRooms[i]._id, {
          lastMessage: lastMessage._id,
          lastActivity: lastMessage.createdAt
        });
      }
    }

    console.log('Database seeded successfully!');
    console.log('\nTest Users:');
    console.log('alice@example.com : 123456');
    console.log('bob@example.com : 123456');
    console.log('charlie@example.com : 123456');
    console.log('diana@example.com : 123456');
    console.log('eve@example.com : 123456');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
