import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import UserSearch from './UserSearch';
import UserProfile from './UserProfile';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const ChatDashboard = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { socket } = useSocket();

  // Function to sort chat rooms by last activity (most recent first)
  const sortChatRooms = (rooms) => {
    return rooms.sort((a, b) => {
      const dateA = new Date(a.lastActivity || a.createdAt);
      const dateB = new Date(b.lastActivity || b.createdAt);
      return dateB - dateA;
    });
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        // Update chat rooms with new message and sort by last activity
        setChatRooms(prev => {
          const updatedRooms = prev.map(room => 
            room._id === message.chatRoomId 
              ? { ...room, lastMessage: message, lastActivity: new Date() }
              : room
          );
          // Sort by last activity (most recent first)
          return sortChatRooms(updatedRooms);
        });
      });

      socket.on('newChatRoom', (newRoom) => {
        setChatRooms(prev => {
          const updatedRooms = [newRoom, ...prev];
          return sortChatRooms(updatedRooms);
        });
      });

      return () => {
        socket.off('receiveMessage');
        socket.off('newChatRoom');
      };
    }
  }, [socket]);

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chatrooms`);
      setChatRooms(response.data);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowUserSearch(false);
    setShowProfile(false);
  };

  const handleNewChat = (newChat) => {
    setChatRooms(prev => [newChat, ...prev]);
    setSelectedChat(newChat);
    setShowUserSearch(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="chat-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <div className="avatar-placeholder">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="username">{user.username}</span>
          </div>
          <div className="header-actions">
            <button
              className="icon-button"
              onClick={() => setShowUserSearch(!showUserSearch)}
              title="New Chat"
            >
              ✚
            </button>
            <button
              className="icon-button"
              onClick={() => setShowProfile(!showProfile)}
              title="Profile"
            >
              ⚙️
            </button>
            <button
              className="icon-button"
              onClick={handleLogout}
              title="Logout"
            >
              ⤴
            </button>
          </div>
        </div>
        
        {showUserSearch ? (
          <UserSearch onChatCreate={handleNewChat} onBack={() => setShowUserSearch(false)} />
        ) : (
          <ChatList
            chatRooms={chatRooms}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
          />
        )}
      </div>
      
      <div className="main-content">
        {showProfile ? (
          <UserProfile onClose={() => setShowProfile(false)} />
        ) : selectedChat ? (
          <ChatWindow
            chatRoom={selectedChat}
            onChatUpdate={(updatedChat) => {
              setChatRooms(prev => {
                const updatedRooms = prev.map(room =>
                  room._id === updatedChat._id ? updatedChat : room
                );
                return sortChatRooms(updatedRooms);
              });
            }}
          />
        ) : (
          <div className="welcome-screen">
            <h2>Welcome to ChatNest</h2>
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
