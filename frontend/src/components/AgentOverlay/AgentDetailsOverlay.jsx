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
        rating,
        completedServices,
        activeStatus,
        serviceType,
        email,
        phone,
        address,
        city,
        joiningDate,
        reviews
    } = agent;

    // Format the rating to display with one decimal place
    const formattedRating = parseFloat(rating || 0).toFixed(1);

    // Format date to be more readable
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

    // Close the overlay when clicking outside the content
    const handleBackdropClick = (e) => {
        if (e.target.className === 'agent-details-overlay') {
            onClose();
        }
    };

    return (
        <div className="agent-details-overlay" onClick={handleBackdropClick}>
            <div className="agent-details-content">
                <button className="close-button" onClick={onClose}>×</button>
                
                <div className="agent-header">
                    <div className="agent-main-info">
                        <div className="agent-avatar">
                            <img
                                src={profileImage ? `${url}/images/agents/${profileImage}` : assets.default_profile}
                                alt={name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = assets.default_profile;
                                }}
                            />
                            <span className={`status-indicator ${activeStatus ? 'active' : 'inactive'}`}>
                                {activeStatus ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                        
                        <div className="agent-identity">
                            <h2>{name}</h2>
                            <div className="agent-service-type">
                                <span className="service-badge">{serviceType}</span>
                            </div>
                            
                            <div className="agent-rating-display">
                                <div className="stars-container">
                                    {renderStars()}
                                </div>
                                <span className="rating-value">{formattedRating}</span>
                                <span className="rating-count">({reviews?.length || 0} reviews)</span>
                            </div>
                            
                            <p className="services-count">
                                <strong>{completedServices || 0}</strong> services completed
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="agent-details-body">
                    <div className="agent-bio-section">
                        <h3>About</h3>
                        <p>{bio || "No bio available"}</p>
                    </div>
                    
                    <div className="agent-details-section">
                        <h3>Contact Information</h3>
                        <ul className="contact-list">
                            <li>
                                <span className="contact-label">Email:</span>
                                <span className="contact-value">{email}</span>
                            </li>
                            <li>
                                <span className="contact-label">Phone:</span>
                                <span className="contact-value">{phone}</span>
                            </li>
                            <li>
                                <span className="contact-label">Address:</span>
                                <span className="contact-value">{address}, {city}</span>
                            </li>
                            <li>
                                <span className="contact-label">Joined:</span>
                                <span className="contact-value">{formatDate(joiningDate)}</span>
                            </li>
                        </ul>
                    </div>
                    
                    {reviews && reviews.length > 0 ? (
                        <div className="agent-reviews-section">
                            <h3>Customer Reviews</h3>
                            <div className="reviews-list">
                                {reviews.map((review, index) => (
                                    <div key={index} className="review-item">
                                        <div className="review-header">
                                            <strong>{review.userName}</strong>
                                            <div className="review-rating">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
                                                ))}
                                            </div>
                                            <span className="review-date">{formatDate(review.date)}</span>
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="agent-reviews-section">
                            <h3>Customer Reviews</h3>
                            <p className="no-reviews">No reviews yet</p>
                        </div>
                    )}
                </div>
                
                <div className="agent-details-footer">
                    <button className="book-service-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentDetailsOverlay;