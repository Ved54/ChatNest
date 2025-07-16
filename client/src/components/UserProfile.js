import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const UserProfile = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/profile`, formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update user context with new data
      // This would require updating the AuthContext to handle profile updates
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>Profile Settings</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="profile-content">
        <div className="profile-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} />
          ) : (
            <div className="avatar-placeholder large">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={20}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-item">
              <label>Username</label>
              <span>{user.username}</span>
            </div>
            <div className="info-item">
              <label>Email</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Status</label>
              <span className={`status ${user.status}`}>{user.status}</span>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>

            {success && <div className="success-message">{success}</div>}

            <div className="profile-actions">
              <button onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
              <button onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) {
                  logout();
                }
              }} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
