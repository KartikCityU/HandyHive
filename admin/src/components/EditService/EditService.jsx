import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../assets/assets';
import './EditService.css'; // Reuse the same CSS

const EditService = () => {
  const [loading, setLoading] = useState(true);
  const [serviceImage, setServiceImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cleaning',
    price: '',
    priceType: 'fixed',
    description: ''
  });
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch service details when component loads
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}/api/services/${id}`);
        
        if (response.data.success) {
          const service = response.data.data;
          setFormData({
            name: service.name,
            category: service.category,
            price: service.price,
            priceType: service.priceType,
            description: service.description
          });
          setCurrentImage(service.image);
        } else {
          toast.error("Failed to fetch service details");
          navigate('/list');
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        toast.error("Error fetching service details");
        navigate('/list');
      } finally {
        setLoading(false);
      }
    };
    
    fetchServiceDetails();
  }, [id, navigate]);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setServiceImage(file);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentImage && !serviceImage) {
      toast.error("Please select a service image");
      return;
    }
    
    try {
      const data = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      // Only append image if a new one is selected
      if (serviceImage) {
        data.append("image", serviceImage);
      }
      
      // Append service ID
      data.append("id", id);
      
      const response = await axios.post(`${url}/api/services/update`, data);
      
      if (response.data.success) {
        toast.success("Service updated successfully");
        navigate('/list');
      } else {
        toast.error(response.data.message || "Failed to update service");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Error updating service");
    }
  };
  
  if (loading) {
    return <div className="loading-indicator">Loading service details...</div>;
  }
  
  return (
    <div className="add">
      <h2>Edit Service</h2>
      <form className="flex-col" onSubmit={handleSubmit}>
        <div className="add-image">
          <p>Service Image</p>
          <input 
            type="file" 
            id="service-image" 
            hidden 
            onChange={handleImageChange}
          />
          <label htmlFor="service-image" className="image-input">
            {serviceImage ? (
              <img 
                src={URL.createObjectURL(serviceImage)} 
                alt="Selected Service" 
                className="selected-image"
              />
            ) : currentImage ? (
              <img 
                src={`${url}/images/${currentImage}`} 
                alt="Current Service" 
                className="selected-image"
              />
            ) : (
              <div className="upload-placeholder">
                <i className="upload-icon">+</i>
                <p>Upload Image</p>
              </div>
            )}
          </label>
        </div>
        
        <div className="add-name flex-col">
          <p>Service Name</p>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="Enter service name" 
            required
          />
        </div>
        
        <div className="add-category flex-col">
          <p>Service Category</p>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleInputChange}
          >
            <option value="Cleaning">Cleaning</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Painting">Painting</option>
            <option value="Home Repair">Home Repair</option>
            <option value="Landscaping">Landscaping</option>
            <option value="Appliance Repair">Appliance Repair</option>
            <option value="HVAC">HVAC</option>
            <option value="Moving">Moving</option>
            <option value="Driver">Driver</option>
          </select>
        </div>
        
        <div className="add-price flex-col">
          <p>Service Price</p>
          <div className="price-container">
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleInputChange} 
              placeholder="Enter price" 
              min="1" 
              required
            />
            <select 
              name="priceType" 
              value={formData.priceType} 
              onChange={handleInputChange}
            >
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Per Hour</option>
              <option value="estimate">Estimate</option>
            </select>
          </div>
        </div>
        
        <div className="add-description flex-col">
          <p>Service Description</p>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleInputChange} 
            placeholder="Enter service description" 
            rows={5} 
            required
          />
        </div>
        
        <button type="submit" className="add-btn">UPDATE SERVICE</button>
      </form>
    </div>
  );
};

export default EditService;