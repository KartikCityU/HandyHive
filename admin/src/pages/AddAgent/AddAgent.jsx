import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddAgent.css';

const AddAgent = () => {
  const navigate = useNavigate();
  const API_URL = 'http://localhost:4000';
  
  const [profileImage, setProfileImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    bio: "",
    serviceType: "Plumber",
    activeStatus: true,
    completedServices: 0,
    rating: 0,
  });
  
  const onChangeHandler = (event) => {
    const name = event.target.name;
    let value;
    
    // Convert numerical fields to numbers
    if (name === 'completedServices' || name === 'rating') {
      value = event.target.type === 'checkbox' ? event.target.checked : Number(event.target.value);
    } else {
      value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    }
    
    setData(data => ({ ...data, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
    e.target.value = '';
  };

  // Rating handler for direct agent rating
  const handleRatingChange = (newRating) => {
    setData(prev => ({ ...prev, rating: Number(newRating) }));
  };
  
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!profileImage) {
      toast.error('Profile image not selected');
      return null;
    }
    
    // Create a copy of the data to ensure numeric fields are sent as numbers
    const formattedData = {
      ...data,
      completedServices: Number(data.completedServices),
      rating: Number(data.rating)
    };
    
    const formData = new FormData();
    
    // Append all agent data, ensuring proper typing
    Object.keys(formattedData).forEach(key => {
      formData.append(key, formattedData[key]);
    });
    
    // Append profile image
    formData.append("profileImage", profileImage);
    
    console.log("Submitting data:", formattedData); // For debugging
    
    try {
      const response = await axios.post(`${API_URL}/api/agents/add`, formData);
      
      if (response.data.success) {
        toast.success("Service agent added successfully");
        navigate('/delivery-agents');
      } else {
        toast.error(response.data.message || "Failed to add service agent");
      }
    } catch (error) {
      console.error("Error adding agent:", error);
      toast.error("Error adding service agent");
    }
  };

  // Star rating component
  const StarRating = ({ rating, onRatingChange }) => {
    const stars = [1, 2, 3, 4, 5];
    
    return (
      <div className="star-rating">
        {stars.map((star) => (
          <span 
            key={star} 
            className={`star ${star <= rating ? 'filled' : ''}`} 
            onClick={() => onRatingChange(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  return (
    <div className='add'>
      <h2>Add New Service Partner</h2>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className='add-profile-image'>
          <p>Profile Photo</p>
          <input 
            onChange={handleImageChange} 
            type="file" 
            accept="image/*" 
            id="profileImage" 
            hidden 
          />
          <label htmlFor="profileImage" className='profile-image-upload'>
            {profileImage ? (
              <img 
                src={URL.createObjectURL(profileImage)} 
                alt="Profile Preview" 
                className="profile-preview" 
              />
            ) : (
              <div className="profile-placeholder">
                <i className="upload-icon">+</i>
                <span>Upload Photo</span>
              </div>
            )}
          </label>
        </div>
        
        {/* Basic agent information */}
        <div className='add-field flex-col'>
          <p>Name</p>
          <input 
            name='name' 
            onChange={onChangeHandler} 
            value={data.name} 
            type="text" 
            placeholder='Full Name' 
            required 
          />
        </div>
        
        <div className='add-field flex-col'>
          <p>Email</p>
          <input 
            name='email' 
            onChange={onChangeHandler} 
            value={data.email} 
            type="email" 
            placeholder='Email Address' 
            required 
          />
        </div>
        
        <div className='add-field flex-col'>
          <p>Phone</p>
          <input 
            name='phone' 
            onChange={onChangeHandler} 
            value={data.phone} 
            type="tel" 
            placeholder='Phone Number' 
            required 
          />
        </div>
        
        <div className='add-field flex-col'>
          <p>Address</p>
          <input 
            name='address' 
            onChange={onChangeHandler} 
            value={data.address} 
            type="text" 
            placeholder='Street Address' 
            required 
          />
        </div>
        
        <div className='add-field flex-col'>
          <p>City</p>
          <input 
            name='city' 
            onChange={onChangeHandler} 
            value={data.city} 
            type="text" 
            placeholder='City' 
            required 
          />
        </div>
        
        <div className='add-category-vehicle'>
          <div className='add-category flex-col'>
            <p>Service Type</p>
            <select name='serviceType' onChange={onChangeHandler} value={data.serviceType}>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrician">Electrician</option>
              <option value="Cleaning">Cleaning</option>
              <option value="HVAC">HVAC</option>
              <option value="Driver">Driver</option>
              <option value="Home Repair">Home Repair</option>
              <option value="Appliance Repair">Appliance Repair</option>
              <option value="Landscaping">Landscaping</option>
            </select>
          </div>
        </div>
        
        {/* Direct Agent Rating */}
        <div className='add-field flex-col'>
          <p>Agent Rating</p>
          <div className="rating-container">
            <StarRating rating={data.rating} onRatingChange={handleRatingChange} />
            <span className="rating-value">{data.rating} out of 5</span>
          </div>
        </div>
        
        <div className='add-field flex-col'>
          <p>Completed Services</p>
          <input 
            name='completedServices' 
            onChange={onChangeHandler} 
            value={data.completedServices} 
            type="number" 
            min="0"
            placeholder='Number of completed services' 
          />
        </div>
        
        <div className='add-field flex-col'>
          <p>Active Status</p>
          <div className="checkbox-container">
            <input 
              name='activeStatus' 
              onChange={onChangeHandler} 
              checked={data.activeStatus} 
              type="checkbox" 
              id="activeStatus"
            />
            <label htmlFor="activeStatus">Available for service</label>
          </div>
        </div>
        
        <div className='add-field flex-col'>
          <p>Bio</p>
          <textarea 
            name='bio' 
            onChange={onChangeHandler} 
            value={data.bio} 
            rows={4} 
            placeholder='Brief description about the service partner' 
          />
        </div>
        
        <button type='submit' className='add-btn'>ADD SERVICE PARTNER</button>
      </form>
    </div>
  );
};

export default AddAgent;