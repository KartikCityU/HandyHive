import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ServicePartnerDetails.css';

const ServicePartnerDetails = () => {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = 'http://localhost:4000';
  
  useEffect(() => {
    fetchAgentDetails();
  }, [id]);
  
  const fetchAgentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/agents/${id}`);
      
      if (response.data.success) {
        setAgent(response.data.data);
        setFormData(response.data.data);
      } else {
        toast.error("Failed to fetch service partner details");
        navigate('/delivery-agents');
      }
    } catch (error) {
      console.error("Error fetching agent details:", error);
      toast.error("Error fetching service partner details");
      navigate('/delivery-agents');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };
  
  const handleRatingChange = (newRating) => {
    setFormData(prev => ({
      ...prev,
      rating: Number(newRating)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      
      // Convert numeric fields to numbers
      const updatedData = {
        ...formData,
        completedServices: Number(formData.completedServices),
        rating: Number(formData.rating)
      };
      
      // Append all fields to form data
      Object.keys(updatedData).forEach(key => {
        // Skip reviews array as it needs special handling
        if (key !== 'reviews') {
          data.append(key, updatedData[key]);
        }
      });
      
      if (profileImage) {
        data.append('profileImage', profileImage);
      }
      
      const response = await axios.put(`${API_URL}/api/agents/${id}`, data);
      
      if (response.data.success) {
        toast.success("Service partner updated successfully");
        setEditing(false);
        fetchAgentDetails();
      } else {
        toast.error(response.data.message || "Failed to update service partner");
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Error updating service partner");
    }
  };
  
  const getProfileImageUrl = (imageName) => {
    if (!imageName || imageName === 'default-agent.png') {
      return '/images/default-agent.png';
    }
    return `${API_URL}/images/agents/${imageName}`;
  };
  
  // Star rating component
  const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
    const stars = [1, 2, 3, 4, 5];
    
    return (
      <div className="star-rating">
        {stars.map((star) => (
          <span 
            key={star} 
            className={`star ${star <= rating ? 'filled' : ''} ${!readOnly ? 'interactive' : ''}`} 
            onClick={() => !readOnly && onRatingChange(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return <div className="loading">Loading service partner details...</div>;
  }
  
  if (!agent) {
    return <div className="error">Service partner not found.</div>;
  }
  
  return (
    <div className="service-partner-details">
      <div className="details-header">
        <button 
          className="back-btn"
          onClick={() => navigate('/delivery-agents')}
        >
          &larr; Back to All Partners
        </button>
        
        <h1>{editing ? 'Edit Service Partner' : 'Service Partner Details'}</h1>
        
        <div className="action-buttons">
          {editing ? (
            <>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setEditing(false);
                  setFormData(agent);
                  setProfileImage(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="save-btn"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button 
              className="edit-btn"
              onClick={() => setEditing(true)}
            >
              Edit Partner
            </button>
          )}
        </div>
      </div>
      
      <div className="partner-content">
        {editing ? (
          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="form-columns">
              <div className="left-column">
                <div className="profile-image-section">
                  <h3>Profile Image</h3>
                  <div className="profile-image-container">
                    <img 
                      src={profileImage ? URL.createObjectURL(profileImage) : getProfileImageUrl(agent.profileImage)} 
                      alt={agent.name} 
                      className="profile-image"
                    />
                    <input 
                      type="file" 
                      id="profileImage" 
                      onChange={handleImageChange} 
                      hidden
                    />
                    <label htmlFor="profileImage" className="change-image-btn">
                      Change Image
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="right-column">
                <div className="form-group">
                  <label>Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={formData.address || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>City</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Service Type</label>
                  <select 
                    name="serviceType" 
                    value={formData.serviceType || 'Plumber'}
                    onChange={handleChange}
                  >
                    <option value="Plumber">Plumber</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Hairdresser">Hairdresser</option>
                    <option value="Pest Control">Pest Control</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Completed Services</label>
                  <input 
                    type="number" 
                    name="completedServices" 
                    value={formData.completedServices || 0}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Rating</label>
                  <div className="rating-input">
                    <StarRating 
                      rating={formData.rating || 0} 
                      onRatingChange={handleRatingChange} 
                    />
                    <span className="rating-value">{formData.rating || 0} out of 5</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="activeStatus" 
                      checked={formData.activeStatus || false}
                      onChange={handleChange}
                    />
                    Active Status
                  </label>
                </div>
                
                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    name="bio" 
                    value={formData.bio || ''}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="partner-details">
            <div className="details-columns">
              <div className="left-column">
                <div className="profile-image-container">
                  <img 
                    src={getProfileImageUrl(agent.profileImage)} 
                    alt={agent.name} 
                    className="profile-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/default-agent.png';
                    }}
                  />
                </div>
              </div>
              
              <div className="right-column">
                <h2>{agent.name}</h2>
                
                <div className="detail-group">
                  <span className="service-badge">{agent.serviceType}</span>
                  <span className={`status-badge ${agent.activeStatus ? 'active' : 'inactive'}`}>
                    {agent.activeStatus ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="rating-container">
                  <StarRating rating={agent.rating || 0} readOnly={true} />
                  <span className="rating-value">{parseFloat(agent.rating || 0).toFixed(1)} out of 5</span>
                </div>
                
                <div className="completed-services">
                  <strong>{agent.completedServices || 0}</strong> services completed
                </div>
                
                <div className="detail-row">
                  <strong>Email:</strong> {agent.email}
                </div>
                
                <div className="detail-row">
                  <strong>Phone:</strong> {agent.phone}
                </div>
                
                <div className="detail-row">
                  <strong>Address:</strong> {agent.address}
                </div>
                
                <div className="detail-row">
                  <strong>City:</strong> {agent.city}
                </div>
                
                <div className="detail-row bio">
                  <strong>Bio:</strong> {agent.bio || 'No bio provided.'}
                </div>
                
                <div className="detail-row">
                  <strong>Joined:</strong> {new Date(agent.joiningDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePartnerDetails;