import React, { useState, useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import './AgentReviewForm.css';

const AgentReviewForm = ({ agentId, onSubmit, onCancel }) => {
    const { token } = useContext(StoreContext);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(null);
    
    // Handle submitting the review
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Get user information from localStorage (assuming it's stored there)
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        const reviewData = {
            userId: userData._id || 'unknown',
            userName: userData.name || 'Anonymous User',
            rating,
            comment
        };
        
        onSubmit(reviewData);
    };
    
    return (
        <div className="agent-review-form-container">
            <div className="agent-review-form">
                <div className="form-header">
                    <h3>Write a Review</h3>
                    <button className="close-button" onClick={onCancel}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="rating-selector">
                        <p>Your Rating</p>
                        <div className="stars-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                    key={star}
                                    className={`
                                        rating-star 
                                        ${hoveredRating >= star ? 'hovered' : ''} 
                                        ${hoveredRating === null && rating >= star ? 'selected' : ''}
                                    `}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(null)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="review-comment">Your Review</label>
                        <textarea
                            id="review-comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this delivery agent..."
                            required
                            rows={5}
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgentReviewForm;