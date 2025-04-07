import React, { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import './AgentDetailsOverlay.css';

const AgentDetailsOverlay = ({ agent, onClose }) => {
    const { url } = useContext(StoreContext);
    const { 
        name, 
        profileImage, 
        bio, 
        averageRating, 
        completedServices, 
        activeStatus, 
        serviceType, 
        contact,
        email,
        specializations
    } = agent;

    // Format the average rating to display with one decimal place
    const formattedRating = parseFloat(averageRating || 0).toFixed(1);

    // Render star rating
    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span 
                key={star} 
                className={`star ${formattedRating >= star ? 'filled' : formattedRating >= star - 0.5 ? 'half-filled' : ''}`}
            >
                ★
            </span>
        ));
    };

    return (
        <div className="agent-details-overlay">
            <div className="agent-details-container">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                
                <div className="agent-details-content">
                    <div className="agent-details-header">
                        <div className="agent-image-container">
                            <img 
                                src={profileImage ? `${url}/images/agents/${profileImage}` : assets.default_profile}
                                alt={name} 
                                className="agent-large-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = assets.default_profile;
                                }}
                            />
                            <div className={`status-indicator ${activeStatus ? 'available' : 'unavailable'}`}>
                                {activeStatus ? 'Available' : 'Unavailable'}
                            </div>
                        </div>
                        
                        <div className="agent-main-info">
                            <h2 className="agent-name">{name}</h2>
                            <div className="agent-rating">
                                <div className="stars-container">
                                    {renderStars()}
                                </div>
                                <span className="rating-value">{formattedRating}</span>
                            </div>
                            
                            {serviceType && (
                                <div className="agent-service-type">
                                    <span className="service-badge">{serviceType}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="agent-details-body">
                        <section className="agent-bio">
                            <h3>About Me</h3>
                            <p>{bio || 'No additional information available.'}</p>
                        </section>
                        
                        <section className="agent-stats">
                            <h3>Performance</h3>
                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-label">Completed Services</span>
                                    <span className="stat-value">{completedServices || 0}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Availability</span>
                                    <span className="stat-value">{activeStatus ? 'Currently Active' : 'Not Available'}</span>
                                </div>
                            </div>
                        </section>
                        
                        <section className="agent-contact">
                            <h3>Contact Information</h3>
                            {contact && (
                                <div className="contact-item">
                                    <span className="contact-label">Phone:</span>
                                    <span className="contact-value">{contact}</span>
                                </div>
                            )}
                            {email && (
                                <div className="contact-item">
                                    <span className="contact-label">Email:</span>
                                    <span className="contact-value">{email}</span>
                                </div>
                            )}
                        </section>
                        
                        {specializations && specializations.length > 0 && (
                            <section className="agent-specializations">
                                <h3>Specializations</h3>
                                <div className="specializations-list">
                                    {specializations.map((spec, index) => (
                                        <span key={index} className="specialization-tag">{spec}</span>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentDetailsOverlay;