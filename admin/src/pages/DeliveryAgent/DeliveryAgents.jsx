import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './DeliveryAgents.css';

const DeliveryAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const API_URL = 'http://localhost:4000';
  
  useEffect(() => {
    fetchAgents();
  }, []);
  
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/agents`);
      
      if (response.data.success) {
        setAgents(response.data.data);
      } else {
        toast.error("Failed to fetch service partners");
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Error fetching service partners");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (agentId) => {
    if (window.confirm("Are you sure you want to delete this service partner?")) {
      try {
        const response = await axios.delete(`${API_URL}/api/agents/${agentId}`);
        
        if (response.data.success) {
          setAgents(agents.filter(agent => agent._id !== agentId));
          toast.success("Service partner deleted successfully");
        } else {
          toast.error(response.data.message || "Failed to delete service partner");
        }
      } catch (error) {
        console.error("Error deleting agent:", error);
        toast.error("Error deleting service partner");
      }
    }
  };

  const getProfileImageUrl = (imageName) => {
    if (!imageName || imageName === 'default-agent.png') {
      return '/images/default-agent.png'; // Default image path
    }
    return `${API_URL}/images/agents/${imageName}`;
  };
  
  return (
    <div className="delivery-agents-admin">
      <div className="agents-header">
        <h1>Manage Service Partners</h1>
        <button 
          className="add-agent-btn"
          onClick={() => navigate('/add-agent')}
        >
          Add New Partner
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Loading service partners...</div>
      ) : agents.length === 0 ? (
        <div className="no-agents">
          <p>No service partners found.</p>
          <button onClick={() => navigate('/add-agent')}>Add your first service partner</button>
        </div>
      ) : (
        <div className="agents-table-container">
          <table className="agents-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Service Type</th>
                <th>City</th>
                <th>Rating</th>
                <th>Services</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent._id}>
                  <td className="agent-photo-cell">
                    <div className="agent-photo-container">
                      <img 
                        src={getProfileImageUrl(agent.profileImage)} 
                        alt={agent.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/default-agent.png';
                        }}
                        className="agent-photo"
                      />
                    </div>
                  </td>
                  <td>{agent.name}</td>
                  <td>{agent.phone}</td>
                  <td>{agent.serviceType}</td>
                  <td>{agent.city}</td>
                  <td className="rating-cell">
                    <div className="rating-display">
                      <span className="rating-value">{parseFloat(agent.rating || 0).toFixed(1)}</span>
                      <span className="rating-star">★</span>
                    </div>
                  </td>
                  <td>{agent.completedServices || 0}</td>
                  <td>
                    <span className={`status-badge ${agent.activeStatus ? 'active' : 'inactive'}`}>
                      {agent.activeStatus ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="view-btn"
                      onClick={() => navigate(`/service-partner/${agent._id}`)}
                    >
                      View
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(agent._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveryAgents;