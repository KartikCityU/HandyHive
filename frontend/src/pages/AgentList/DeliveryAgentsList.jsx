import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import DeliveryAgentCard from '../../components/DeliveryAgentCard/DeliveryAgentCard';
import axios from 'axios';
import { toast } from 'react-toastify';
import './DeliveryAgentsList.css';

const DeliveryAgentsList = () => {
    const { url } = useContext(StoreContext);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterActive, setFilterActive] = useState(false);
    const [sortBy, setSortBy] = useState('rating'); // 'rating' or 'deliveries'
    
    // Fetch all delivery agents
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}/api/agents`);
                
                if (response.data.success) {
                    setAgents(response.data.data);
                } else {
                    toast.error("Failed to load delivery agents");
                }
            } catch (error) {
                console.error("Error fetching agents:", error);
                toast.error("Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        
        fetchAgents();
    }, [url]);
    
    // Filter and sort agents
    const filteredAndSortedAgents = [...agents]
        .filter(agent => !filterActive || agent.activeStatus)
        .sort((a, b) => {
            if (sortBy === 'rating') {
                return b.averageRating - a.averageRating;
            } else {
                return b.completedDeliveries - a.completedDeliveries;
            }
        });
    
    return (
        <div className="delivery-agents-list-container">
            <div className="agents-header">
                <h1>Our Service Partners</h1>
                <p>Meet our team of professional service agents ready to serve you</p>
            </div>
            
            <div className="agents-filter-sort">
                <div className="filter-option">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={filterActive} 
                            onChange={() => setFilterActive(!filterActive)} 
                        />
                        Show only available agents
                    </label>
                </div>
                
                <div className="sort-options">
                    <span>Sort by:</span>
                    <button 
                        className={sortBy === 'rating' ? 'active' : ''} 
                        onClick={() => setSortBy('rating')}
                    >
                        Rating
                    </button>
                    <button 
                        className={sortBy === 'deliveries' ? 'active' : ''} 
                        onClick={() => setSortBy('deliveries')}
                    >
                        Experience
                    </button>
                </div>
            </div>
            
            {loading ? (
                <div className="loading-agents">Loading service agents...</div>
            ) : filteredAndSortedAgents.length === 0 ? (
                <div className="no-agents-found">
                    {filterActive 
                        ? "No available agents at the moment. Please try again later."
                        : "No service agents found."}
                </div>
            ) : (
                <div className="agents-grid">
                    {filteredAndSortedAgents.map(agent => (
                        <DeliveryAgentCard key={agent._id} agent={agent} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DeliveryAgentsList;