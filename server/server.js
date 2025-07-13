require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('User connected: ' + socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });

  socket.on('joinRoom', ({ chatRoomId }) => {
    socket.join(chatRoomId);
    console.log(`User ${socket.id} joined room ${chatRoomId}`);
  });

  socket.on('leaveRoom', ({ chatRoomId }) => {
    socket.leave(chatRoomId);
    console.log(`User ${socket.id} left room ${chatRoomId}`);
  });

  socket.on('sendMessage', ({ chatRoomId, message }) => {
    console.log(`Message from ${socket.id}: ${message}`);
    io.to(chatRoomId).emit('receiveMessage', message);
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chatrooms', require('./routes/chatrooms'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.send('ChatNest API Running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

