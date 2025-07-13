# ChatNest - Real-Time Chat Application

A full-stack MERN (MongoDB, Express, React, Node.js) chat application with real-time messaging, user authentication, and both one-on-one and group chat capabilities.

## Features

- **Real-time messaging** with Socket.IO
- **User authentication** with JWT tokens
- **One-on-one and group chats**
- **User search** and chat creation
- **Typing indicators**
- **Message read receipts**
- **Clean, responsive UI**
- **Form validation and error handling**
- **Loading states** throughout the app

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React** with Hooks and Context API
- **Axios** for HTTP requests
- **Socket.IO Client** for real-time features
- **React Router** for navigation
- **Custom CSS** for styling

## Project Structure

```
ChatNest/
├── server/                 # Backend Node.js application
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── scripts/           # Database seeding scripts
│   └── server.js          # Main server file
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Context providers
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ChatNest
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/chatnest
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Note**: Replace `MONGODB_URI` with your actual MongoDB connection string if using MongoDB Atlas.

### 3. Frontend Setup

```bash
cd ../client
npm install
```

### 4. Database Seeding (Optional)

To populate the database with dummy users and chat data:

```bash
cd server
npm run seed
```

This will create 5 test users with the following credentials:
- alice@example.com : 123456
- bob@example.com : 123456
- charlie@example.com : 123456
- diana@example.com : 123456
- eve@example.com : 123456

## Running the Application

### Development Mode

You need to run both the backend and frontend servers:

#### 1. Start the Backend Server

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5001`

#### 2. Start the Frontend Client

```bash
cd client
npm start
```

The client will run on `http://localhost:3000`

### Production Build

To build the client for production:

```bash
cd client
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Chat Rooms
- `GET /api/chatrooms` - Get user's chat rooms
- `POST /api/chatrooms` - Create new chat room
- `GET /api/chatrooms/:id/messages` - Get messages for a chat room

### Messages
- `POST /api/messages` - Send a message
- `PUT /api/messages/:id/read` - Mark message as read

### Users
- `GET /api/users/search` - Search users
- `PUT /api/users/profile` - Update user profile

## Socket.IO Events

### Client to Server
- `joinRoom` - Join a chat room
- `leaveRoom` - Leave a chat room
- `sendMessage` - Send a message
- `typing` - Send typing indicator

### Server to Client
- `receiveMessage` - Receive a new message
- `onlineUsers` - Get list of online users
- `typing` - Receive typing indicator

## Usage

1. **Registration/Login**: Create an account or login with existing credentials
2. **Chat List**: View all your active chats in the sidebar
3. **New Chat**: Click the "+" button to search for users and start new chats
4. **Group Chats**: Toggle to group chat mode to create multi-user conversations
5. **Messaging**: Click on a chat to start messaging with real-time updates
6. **Profile**: Click the settings icon to view and edit your profile

## Features in Detail

### Real-time Messaging
- Messages are instantly delivered using Socket.IO
- Typing indicators show when someone is typing
- Messages are persisted in MongoDB

### User Authentication
- JWT-based authentication
- Protected routes on both client and server
- Automatic token verification

### Chat Management
- One-on-one chats are automatically created between users
- Group chats support multiple participants with admin controls
- Chat history is maintained and searchable

### User Interface
- Clean, modern design with responsive layout
- Loading states for all async operations
- Form validation with error handling
- Smooth animations and transitions

## Environment Variables

### Server (.env)
```env
PORT=5001                              # Server port
MONGODB_URI=mongodb://localhost:27017/chatnest  # MongoDB connection string
JWT_SECRET=your-jwt-secret-key         # JWT signing secret
NODE_ENV=development                   # Environment mode
CLIENT_URL=http://localhost:3000       # Frontend URL for CORS
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify the `MONGODB_URI` in your `.env` file

2. **CORS Issues**
   - Make sure `CLIENT_URL` in server `.env` matches your frontend URL
   - Check that the client is making requests to the correct backend URL

3. **Authentication Issues**
   - Ensure `JWT_SECRET` is set in the server environment
   - Check that tokens are being sent in the `Authorization` header

4. **Socket.IO Connection Issues**
   - Verify that both client and server are using the same Socket.IO version
   - Check that the client is connecting to the correct server URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue in the repository or contact the development team.
