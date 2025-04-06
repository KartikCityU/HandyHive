import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddAgent.css';

const AddAgent = () => {
  const navigate = useNavigate();
  const API_URL = 'http://localhost:4000';
  
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    bio: "",
    serviceType: "Plumber",
  });
  
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };
  
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post(`${API_URL}/api/agents/add`, data);
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
  
  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
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
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Cleaner">Cleaner</option>
              <option value="HVAC">HVAC</option>
            </select>
          </div>
          
        </div>
        
        <div className='add-field flex-col'>
          <p>Bio</p>
          <textarea 
            name='bio' 
            onChange={onChangeHandler} 
            value={data.bio} 
            rows={4} 
            placeholder='Brief description about the delivery partner' 
          />
        </div>
        
        <button type='submit' className='add-btn'>ADD SERVICE PARTNER</button>
      </form>
    </div>
  );
};

export default AddAgent;