import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SOCKET_URL } from '../config/api';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);

      // Join user to their own room for private notifications
      newSocket.emit('join', { userId: user._id });

      // Listen for online users
      newSocket.on('onlineUsers', (users) => {
        setOnlineUsers(users);
      });

      // Listen for typing indicators
      newSocket.on('typing', ({ userId, chatRoomId, isTyping }) => {
        setTypingUsers(prev => ({
          ...prev,
          [chatRoomId]: isTyping 
            ? [...(prev[chatRoomId] || []), userId]
            : (prev[chatRoomId] || []).filter(id => id !== userId)
        }));
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const joinRoom = (chatRoomId) => {
    if (socket) {
      socket.emit('joinRoom', { chatRoomId });
    }
  };

  const leaveRoom = (chatRoomId) => {
    if (socket) {
      socket.emit('leaveRoom', { chatRoomId });
    }
  };

  const sendMessage = (chatRoomId, message) => {
    if (socket) {
      socket.emit('sendMessage', { chatRoomId, message });
    }
  };

  const sendTyping = (chatRoomId, isTyping) => {
    if (socket) {
      socket.emit('typing', { chatRoomId, isTyping });
    }
  };

  const markMessageAsRead = (messageId, chatRoomId) => {
    if (socket) {
      socket.emit('markAsRead', { messageId, chatRoomId });
    }
  };

  return (
    <SocketContext.Provider value={{
      socket,
      onlineUsers,
      typingUsers,
      joinRoom,
      leaveRoom,
      sendMessage,
      sendTyping,
      markMessageAsRead
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
