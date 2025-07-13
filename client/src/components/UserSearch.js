import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const UserSearch = ({ onChatCreate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupChatMode, setGroupChatMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5020/api/users/search?q=${searchQuery}`);
      setSearchResults(response.data.filter(u => u._id !== user._id));
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (selectedUser) => {
    if (groupChatMode) {
      setSelectedUsers(prev => 
        prev.find(u => u._id === selectedUser._id)
          ? prev.filter(u => u._id !== selectedUser._id)
          : [...prev, selectedUser]
      );
    } else {
      createOneOnOneChat(selectedUser);
    }
  };

  const createOneOnOneChat = async (otherUser) => {
    try {
      const response = await axios.post('http://localhost:5020/api/chatrooms', {
        participants: [user._id, otherUser._id],
        isGroupChat: false
      });
      onChatCreate(response.data);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const createGroupChat = async () => {
    if (selectedUsers.length < 2) {
      alert('Please select at least 2 users for a group chat');
      return;
    }

    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5020/api/chatrooms', {
        name: groupName,
        participants: [user._id, ...selectedUsers.map(u => u._id)],
        isGroupChat: true,
        admin: user._id
      });
      onChatCreate(response.data);
      setSelectedUsers([]);
      setGroupName('');
    } catch (error) {
      console.error('Error creating group chat:', error);
    }
  };

  return (
    <div className="user-search">
      <div className="search-header">
        <div className="search-mode-toggle">
          <button
            className={!groupChatMode ? 'active' : ''}
            onClick={() => setGroupChatMode(false)}
          >
            Direct Chat
          </button>
          <button
            className={groupChatMode ? 'active' : ''}
            onClick={() => setGroupChatMode(true)}
          >
            Group Chat
          </button>
        </div>
      </div>

      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {groupChatMode && (
        <div className="group-chat-config">
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="group-name-input"
          />
          
          {selectedUsers.length > 0 && (
            <div className="selected-users">
              <h4>Selected Users ({selectedUsers.length})</h4>
              {selectedUsers.map(user => (
                <div key={user._id} className="selected-user">
                  <span>{user.username}</span>
                  <button onClick={() => handleUserSelect(user)}>×</button>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={createGroupChat}
            disabled={selectedUsers.length < 2 || !groupName.trim()}
            className="create-group-button"
          >
            Create Group Chat
          </button>
        </div>
      )}

      <div className="search-results">
        {loading ? (
          <div className="loading">Searching...</div>
        ) : (
          searchResults.map(foundUser => (
            <div
              key={foundUser._id}
              className={`user-result ${
                groupChatMode && selectedUsers.find(u => u._id === foundUser._id) ? 'selected' : ''
              }`}
              onClick={() => handleUserSelect(foundUser)}
            >
              <div className="user-avatar">
                {foundUser.avatar ? (
                  <img src={foundUser.avatar} alt={foundUser.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {foundUser.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="user-info">
                <span className="username">{foundUser.username}</span>
                <span className="email">{foundUser.email}</span>
              </div>
              {groupChatMode && (
                <div className="selection-indicator">
                  {selectedUsers.find(u => u._id === foundUser._id) ? '✓' : '○'}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserSearch;
