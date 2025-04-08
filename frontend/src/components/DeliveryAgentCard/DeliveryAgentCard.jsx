import React, { useState, useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import AgentDetailsOverlay from '../AgentOverlay/AgentDetailsOverlay';
import './DeliveryAgentCard.css';

const DeliveryAgentCard = ({ agent }) => {
    const [showDetailsOverlay, setShowDetailsOverlay] = useState(false);
    const { url } = useContext(StoreContext);
    const { 
        _id, 
        name, 
        profileImage, 
        bio, 
        rating, // Changed from averageRating to rating
        completedServices, 
        activeStatus, 
        serviceType 
    } = agent;
    
    // Format the rating to display with one decimal place
    const formattedRating = parseFloat(rating || 0).toFixed(1);
    
    // Format bio text to show only first 60 characters with ellipsis
    const formatBio = (text) => {
        if (!text) return '';
        return text.length > 60 ? `${text.substring(0, 60)}...` : text;
    };

    // Render stars with proper half-star support
    const renderStars = () => {
        const stars = [];
        const ratingValue = parseFloat(formattedRating);
        
        for (let i = 1; i <= 5; i++) {
            if (ratingValue >= i) {
                // Full star
                stars.push(<span key={i} className="star filled">★</span>);
            } else if (ratingValue >= i - 0.5) {
                // Half star
                stars.push(
                    <span key={i} className="star half-filled">
                        <span className="half-star-overlay">★</span>
                    </span>
                );
            } else {
                // Empty star
                stars.push(<span key={i} className="star">★</span>);
            }
        }
        
        return stars;
    };

    return (
        <>
            <div 
                className={`delivery-agent-card ${!activeStatus ? 'inactive' : ''}`} 
                onClick={() => setShowDetailsOverlay(true)}
            >
                <div className="agent-status-badge">
                    {activeStatus ? 'Available' : 'Unavailable'}
                </div>
                
                <div className="agent-image-container">
                    <img 
                        src={profileImage ? `${url}/images/agents/${profileImage}` : assets.default_profile}
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
                            {renderStars()}
                        </div>
                        <span className="rating-value">{formattedRating}</span>
                    </div>
                    
                    {bio && (
                        <p className="agent-bio">{formatBio(bio)}</p>
                    )}
                    
                    <p className="agent-deliveries">
                        <span className="delivery-count">{completedServices || 0}</span> services completed
                    </p>
                </div>
            </div>

            {/* Render the overlay when showDetailsOverlay is true */}
            {showDetailsOverlay && (
                <AgentDetailsOverlay 
                    agent={agent} 
                    onClose={() => setShowDetailsOverlay(false)} 
                />
            )}
        </>
    );
};

export default DeliveryAgentCard;