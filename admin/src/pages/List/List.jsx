import React, { useEffect, useState } from 'react'
import './List.css'
import { url, currency } from '../../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/services/list`)
      if (response.data.success) {
        setServices(response.data.data);
      } else {
        toast.error("Failed to load services")
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Error loading services")
    } finally {
      setLoading(false);
    }
  }

  const removeService = async (serviceId) => {
    if (window.confirm("Are you sure you want to remove this service?")) {
      try {
        const response = await axios.post(`${url}/api/services/remove`, {
          id: serviceId
        });
        
        if (response.data.success) {
          toast.success(response.data.message);
          fetchServices(); // Refresh the list
        } else {
          toast.error(response.data.message || "Error removing service")
        }
      } catch (error) {
        console.error("Error removing service:", error);
        toast.error("Failed to remove service")
      }
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className='list add flex-col'>
      <h2>All Services</h2>
      
      {loading ? (
        <div className="loading-indicator">Loading services...</div>
      ) : services.length === 0 ? (
        <div className="no-services">
          <p>No services found. Add some services to get started.</p>
        </div>
      ) : (
        <div className='list-table'>
          <div className="list-table-format title">
            <b>Image</b>
            <b>Service Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>
          </div>
          
          {services.map((service) => (
            <div key={service._id} className='list-table-format'>
              <img 
                src={`${url}/images/` + service.image} 
                alt={service.name} 
                className="service-image"
              />
              <div className="service-name">
                <p>{service.name}</p>
                <span className="service-description">{service.description.substring(0, 50)}...</span>
              </div>
              <p className="service-category">{service.category}</p>
              <p className="service-price">
                <span className="price-value">{currency}{service.price}</span>
                {service.priceType === 'hourly' && <span className="price-type">/hr</span>}
                {service.priceType === 'estimate' && <span className="price-type">est.</span>}
              </p>
              <div className="action-buttons">
                <button 
                  className="edit-button" 
                  onClick={() => toast.info("Edit functionality coming soon")}
                >
                  Edit
                </button>
                <button 
                  className="delete-button" 
                  onClick={() => removeService(service._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default List