import React from 'react';

const ChatList = ({ chatRooms, selectedChat, onChatSelect }) => {
  return (
    <div className="chat-list">
      {chatRooms.map(chat => (
        <div
          key={chat._id}
          className={`chat-item ${selectedChat?._id === chat._id ? 'selected' : ''}`}
          onClick={() => onChatSelect(chat)}
        >
          <div className="chat-info">
            <span className="chat-name">{chat.name || 'Unnamed Chat'}</span>
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

