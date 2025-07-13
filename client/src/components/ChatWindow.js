import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';

const ChatWindow = ({ chatRoom, onChatUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { user } = useAuth();
  const { socket, joinRoom, leaveRoom, sendMessage, sendTyping, typingUsers } = useSocket();

  useEffect(() => {
    if (chatRoom) {
      fetchMessages();
      joinRoom(chatRoom._id);
    }

    return () => {
      if (chatRoom) {
        leaveRoom(chatRoom._id);
      }
    };
  }, [chatRoom]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        if (message.chatRoomId === chatRoom._id) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket, chatRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5020/api/chatrooms/${chatRoom._id}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      chatRoomId: chatRoom._id,
      message: newMessage.trim(),
      sender: user
    };

    try {
      const response = await axios.post('http://localhost:5020/api/messages', messageData);
      sendMessage(chatRoom._id, response.data);
      setNewMessage('');
      
      // Stop typing indicator
      if (isTyping) {
        sendTyping(chatRoom._id, false);
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(chatRoom._id, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(chatRoom._id, false);
    }, 1000);
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getChatDisplayName = () => {
    if (chatRoom.isGroupChat) {
      return chatRoom.name;
    } else {
      // For one-on-one chats, show the other participant's name
      const otherParticipant = chatRoom.participants.find(p => p._id !== user._id);
      return otherParticipant ? otherParticipant.username : 'Unknown User';
    }
  };

  if (loading) {
    return (
      <div className="chat-window">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  const currentTypingUsers = typingUsers[chatRoom._id] || [];
  const otherTypingUsers = currentTypingUsers.filter(userId => userId !== user._id);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{getChatDisplayName()}</h3>
        <div className="chat-info">
          {chatRoom.isGroupChat && (
            <span className="participant-count">
              {chatRoom.participants.length} members
            </span>
          )}
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${message.sender._id === user._id ? 'own' : 'other'}`}
          >
            <div className="message-content">
              <div className="message-header">
                <span className="sender-name">{message.sender.username}</span>
                <span className="message-time">{formatMessageTime(message.createdAt)}</span>
              </div>
              <div className="message-text">{message.message}</div>
            </div>
          </div>
        ))}
        
        {otherTypingUsers.length > 0 && (
          <div className="typing-indicator">
            <span>Someone is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
