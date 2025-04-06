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
        toast.error("Failed to fetch delivery agents");
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Error fetching agents");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (agentId) => {
    if (window.confirm("Are you sure you want to delete this delivery agent?")) {
      try {
        const response = await axios.delete(`${API_URL}/api/agents/${agentId}`);
        
        if (response.data.success) {
          setAgents(agents.filter(agent => agent._id !== agentId));
          toast.success("Delivery agent deleted successfully");
        } else {
          toast.error(response.data.message || "Failed to delete agent");
        }
      } catch (error) {
        console.error("Error deleting agent:", error);
        toast.error("Error deleting agent");
      }
    }
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
        <div className="loading">Loading delivery agents...</div>
      ) : agents.length === 0 ? (
        <div className="no-agents">
          <p>No delivery agents found.</p>
          <button onClick={() => navigate('/add-agent')}>Add your first delivery partner</button>
        </div>
      ) : (
        <div className="agents-table-container">
          <table className="agents-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>City</th>
                <th>Rating</th>
                <th>Deliveries</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent._id}>
                  <td>{agent.name}</td>
                  <td>{agent.phone}</td>
                  <td>{agent.city}</td>
                  <td>{agent.averageRating || 0}</td>
                  <td>{agent.completedDeliveries || 0}</td>
                  <td>{agent.activeStatus ? 'Active' : 'Inactive'}</td>
                  <td>
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