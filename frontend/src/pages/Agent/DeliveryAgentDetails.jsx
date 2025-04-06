import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import './DeliveryAgentDetails.css';
import { assets } from '../../assets/assets';
// import AgentReviewForm from './AgentReviewForm';

const DeliveryAgentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { url, token } = useContext(StoreContext);
    
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userHasOrdered, setUserHasOrdered] = useState(false);
    
    // Fetch agent details
    useEffect(() => {
        const fetchAgentDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${url}/api/agents/${id}`);
                
                if (response.data.success) {
                    setAgent(response.data.data);
                } else {
                    toast.error("Failed to load agent details");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching agent details:", error);
                toast.error("Something went wrong");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        
        // Check if user has ordered from this agent (to enable reviews)
        const checkUserOrders = async () => {
            if (!token) return;
            
            try {
                const response = await axios.post(
                    `${url}/api/order/user-agent-orders`,
                    { agentId: id },
                    { headers: { token } }
                );
                
                if (response.data.success && response.data.hasOrders) {
                    setUserHasOrdered(true);
                }
            } catch (error) {
                console.error("Error checking user orders:", error);
            }
        };
        
        fetchAgentDetails();
        checkUserOrders();
    }, [id, url, navigate, token]);
    
    // Handle submit review
    const handleSubmitReview = async (reviewData) => {
        if (!token) {
            toast.error("Please login to submit a review");
            return;
        }
        
        try {
            const response = await axios.post(
                `${url}/api/agents/${id}/review`,
                reviewData,
                { headers: { token } }
            );
            
            if (response.data.success) {
                toast.success("Review submitted successfully");
                setAgent(response.data.data);
                setShowReviewForm(false);
            } else {
                toast.error(response.data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Something went wrong");
        }
    };
    
    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }
    
    if (!agent) {
        return <div className="error-message">Agent not found</div>;
    }
    
    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    return (
        <div className="agent-details-container">
            <div className="agent-details-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    &larr; Back
                </button>
                <h1>Delivery Agent Details</h1>
            </div>
            
            <div className="agent-profile-section">
                <div className="agent-profile-image">
                    <img 
                        src={agent.profileImage ? `${url}/uploads/agents/${agent.profileImage}` : assets.default_profile} 
                        alt={agent.name} 
                    />
                    <div className={`status-indicator ${agent.activeStatus ? 'active' : 'inactive'}`}>
                        {agent.activeStatus ? 'Available' : 'Unavailable'}
                    </div>
                </div>
                
                <div className="agent-profile-info">
                    <h2>{agent.name}</h2>
                    
                    <div className="agent-stats">
                        <div className="agent-stat">
                            <div className="stat-value">{agent.completedDeliveries}</div>
                            <div className="stat-label">Deliveries</div>
                        </div>
                        
                        <div className="agent-stat">
                            <div className="stat-value">
                                <div className="rating-with-stars">
                                    {parseFloat(agent.averageRating).toFixed(1)}
                                    <div className="mini-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                                key={star} 
                                                className={`mini-star ${agent.averageRating >= star ? 'filled' : ''}`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="stat-label">Rating</div>
                        </div>
                        
                        <div className="agent-stat">
                            <div className="stat-value">{agent.reviews.length}</div>
                            <div className="stat-label">Reviews</div>
                        </div>
                    </div>
                    
                    <div className="agent-details">
                        <div className="detail-item">
                            <span className="detail-label">Joined:</span>
                            <span className="detail-value">{formatDate(agent.joiningDate)}</span>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-label">City:</span>
                            <span className="detail-value">{agent.city}</span>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-label">Vehicle:</span>
                            <span className="detail-value">{agent.vehicleType}</span>
                        </div>
                    </div>
                    
                    {agent.bio && (
                        <div className="agent-bio">
                            <h3>About</h3>
                            <p>{agent.bio}</p>
                        </div>
                    )}
                    
                    {userHasOrdered && (
                        <button 
                            className="write-review-button"
                            onClick={() => setShowReviewForm(true)}
                        >
                            Write a Review
                        </button>
                    )}
                </div>
            </div>
            
            <div className="agent-reviews-section">
                <h3>Customer Reviews ({agent.reviews.length})</h3>
                
                {agent.reviews.length === 0 ? (
                    <div className="no-reviews">
                        No reviews yet. Be the first to leave a review!
                    </div>
                ) : (
                    <div className="reviews-list">
                        {agent.reviews.map((review, index) => (
                            <div key={index} className="review-item">
                                <div className="review-header">
                                    <div className="reviewer-name">{review.userName}</div>
                                    <div className="review-date">{formatDate(review.date)}</div>
                                </div>
                                
                                <div className="review-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span 
                                            key={star} 
                                            className={`review-star ${review.rating >= star ? 'filled' : ''}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="review-comment">
                                    {review.comment}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {showReviewForm && (
                <div className="review-form-overlay">
                    <AgentReviewForm 
                        agentId={id} 
                        onSubmit={handleSubmitReview} 
                        onCancel={() => setShowReviewForm(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default DeliveryAgentDetails;