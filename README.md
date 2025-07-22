# ChatNest - Real-Time Chat Application

A fully containerized MERN (MongoDB, Express, React, Node.js) chat application with real-time messaging, user authentication, and both one-on-one and group chat capabilities. Now with Docker support for easy deployment and development.

## Features

- **Real-time messaging** with Socket.IO
- **User authentication** with JWT tokens
- **One-on-one and group chats**
- **User search** and chat creation
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
│   ├── Dockerfile         # Server Docker configuration
│   └── server.js          # Main server file
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Context providers
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── Dockerfile         # Client Docker configuration
├── scripts/               # Database initialization
│   └── mongo-init.js      # MongoDB setup script
├── docker-compose.yml     # Docker services configuration
├── .env.docker           # Docker environment variables
└── README.md
```

## 🐳 Docker Setup (Recommended)

### Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd ChatNest

# Copy environment file and customize passwords
cp .env.docker.example .env.docker
# Edit .env.docker with your secure passwords

# Create server environment
echo 'PORT=5001
MONGODB_URI=mongodb://admin:password123@mongodb:27017/chatNest?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
CLIENT_URL=http://localhost:3000' > server/.env

# Create client environment
echo 'REACT_APP_API_URL=http://localhost:5001
REACT_APP_SOCKET_URL=http://localhost:5001' > client/.env

# Start everything
docker-compose --env-file .env.docker up -d
```

Access: http://localhost:3000 | Admin: http://localhost:8081

### Prerequisites

- Docker
- Docker Compose

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ChatNest
```

### 2. Environment Setup

Create your Docker environment file from the example:

```bash
# Copy the example file
cp .env.docker.example .env.docker
```

Edit `.env.docker` and update the passwords:

```env
# MongoDB Configuration
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=MyS3cur3M0ng0P@ssw0rd!2024
MONGO_DATABASE=chatNest

# Mongo Express Configuration (Database Admin UI)
MONGO_EXPRESS_USERNAME=admin
MONGO_EXPRESS_PASSWORD=Adm1nP@ssw0rd!Secure2024

# Port Configuration
CLIENT_PORT=3000
SERVER_PORT=5001
MONGO_PORT=27017
MONGO_EXPRESS_PORT=8081
```

**⚠️ Important**: Replace the example passwords with your own secure passwords!

### 3. Create Environment Files

Create `server/.env`:

```env
PORT=5001
MONGODB_URI=mongodb://admin:your-secure-mongo-password@mongodb:27017/chatNest?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_SOCKET_URL=http://localhost:5001
```

### 4. Start the Application

```bash
# Start all services
docker-compose --env-file .env.docker up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Mongo Express**: http://localhost:8081 (admin/admin123)
- **MongoDB**: mongodb://localhost:27017

### 6. Database Seeding (Optional)

Seed the database with test data:

```bash
# Enter the server container
docker exec -it chatnest-server-1 npm run seed
```

Test users created:
- alice@example.com : 123456
- bob@example.com : 123456
- charlie@example.com : 123456
- diana@example.com : 123456
- eve@example.com : 123456

## 💻 Traditional Setup (Alternative)

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Steps

1. **Install Dependencies**
   ```bash
   # Backend
   cd server && npm install
   
   # Frontend  
   cd ../client && npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env` in both `server/` and `client/` directories
   - Update MongoDB URI and other settings

3. **Start Services**
   ```bash
   # Terminal 1: Start MongoDB (if local)
   mongod
   
   # Terminal 2: Start server
   cd server && npm run dev
   
   # Terminal 3: Start client
   cd client && npm start
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
CORS_ORIGIN=http://localhost:3000      # CORS origin
```

### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5001    # Backend API URL
REACT_APP_SOCKET_URL=http://localhost:5001 # Socket.IO server URL
```

## Security Improvements

- **Environment Variables**: All API endpoints now use environment variables instead of hardcoded URLs
- **Centralized Configuration**: API configuration is managed through a single config file
- **Development vs Production**: Easy switching between development and production environments
- **Security**: Sensitive URLs are not exposed in the source code

## 🐛 Troubleshooting

### Docker Issues

1. **Containers won't start**
   ```bash
   # Check if ports are already in use
   docker ps
   
   # Stop conflicting containers
   docker-compose down
   
   # Rebuild containers
   docker-compose --env-file .env.docker up -d --build
   ```

2. **MongoDB connection failed**
   ```bash
   # Check MongoDB container logs
   docker logs mongodb
   
   # Restart MongoDB container
   docker restart mongodb
   ```

3. **Environment variables not loaded**
   - Ensure you're using `--env-file .env.docker` flag
   - Check that `.env.docker` file exists and has correct values
   - Restart containers after changing environment variables

4. **Can't access Mongo Express (port 8081)**
   - Verify container is running: `docker ps`
   - Check logs: `docker logs mongo-express`
   - Try: http://localhost:8081 (login: admin/admin123)

### Application Issues

1. **Frontend can't connect to backend**
   - Check that both containers are on the same network
   - Verify `REACT_APP_API_URL` in client `.env`
   - Check server logs: `docker logs chatnest-server-1`

2. **Database connection issues**
   - Ensure MongoDB URI includes `authSource=admin`
   - Check credentials match between `.env.docker` and `server/.env`
   - Verify network connectivity between containers

3. **Socket.IO not working**
   - Check browser console for connection errors
   - Verify both containers are running and accessible
   - Ensure `REACT_APP_SOCKET_URL` is set correctly

### Useful Commands

```bash
# View all container logs
docker-compose logs

# View specific service logs
docker-compose logs server
docker-compose logs mongodb

# Access container shell
docker exec -it chatnest-server-1 /bin/sh
docker exec -it mongodb mongosh

# Check container status
docker ps

# Restart specific service
docker-compose restart server

# Complete cleanup
docker-compose down -v
docker system prune -f
```

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
