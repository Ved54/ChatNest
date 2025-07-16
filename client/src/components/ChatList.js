import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ChatList = ({ chatRooms, selectedChat, onChatSelect }) => {
  const { user } = useAuth();
  
  const getChatDisplayName = (chat) => {
    if (chat.isGroupChat) {
      return chat.name || 'Unnamed Group';
    } else {
      // For one-on-one chats, show the other participant's name
      const otherParticipant = chat.participants.find(p => p._id !== user._id);
      return otherParticipant ? otherParticipant.username : 'Unknown User';
    }
  };
  return (
    <div className="chat-list">
      {chatRooms.map(chat => (
        <div
          key={chat._id}
          className={`chat-item ${selectedChat?._id === chat._id ? 'selected' : ''}`}
          onClick={() => onChatSelect(chat)}
        >
          <div className="chat-info">
            <span className="chat-name">{getChatDisplayName(chat)}</span>
            <span className="last-message">
              {chat.lastMessage ? chat.lastMessage.message : 'No messages yet'}
            </span>
          </div>
          <div className="chat-meta">
            <span className="chat-time">
              {chat.lastActivity ? new Date(chat.lastActivity).toLocaleTimeString() : ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;

