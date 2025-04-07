import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryAgentCard.css';
import { assets } from '../../assets/assets';

const DeliveryAgentCard = ({ agent }) => {
    const navigate = useNavigate();
    const { _id, name, profileImage, bio, averageRating, completedServices, activeStatus, serviceType } = agent;
    
    // Format the average rating to display with one decimal place
    const formattedRating = parseFloat(averageRating || 0).toFixed(1);
    
    // Navigate to agent details page when clicked
    const handleClick = () => {
        navigate(`/agent/${_id}`);
    };
    
    return (
        <div className={`delivery-agent-card ${!activeStatus ? 'inactive' : ''}`} onClick={handleClick}>
            <div className="agent-status-badge">
                {activeStatus ? 'Available' : 'Unavailable'}
            </div>
            
            <div className="agent-image-container">
                <img 
                    src={profileImage ? `${import.meta.env.VITE_API_URL}/images/agents/${profileImage}` : assets.default_profile}
                    alt={name} 
                    className="agent-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = assets.default_profile;
                    }}
                />
            </div>
            
            <div className="agent-info">
                <h3 className="agent-name">{name}</h3>
                
                {serviceType && (
                    <div className="agent-vehicle">
                        <span className="vehicle-badge">{serviceType}</span>
                    </div>
                )}
                
                <div className="agent-rating">
                    <div className="stars-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span 
                                key={star} 
                                className={`star ${formattedRating >= star ? 'filled' : formattedRating >= star - 0.5 ? 'half-filled' : ''}`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                    <span className="rating-value">{formattedRating}</span>
                </div>

                <p className="agent-deliveries">
                    <span className="delivery-count">{bio}</span> 
                </p>
                
                <p className="agent-deliveries">
                    <span className="delivery-count">{completedServices || 0}</span> services completed
                </p>
            </div>
        </div>
    );
};

export default DeliveryAgentCard;