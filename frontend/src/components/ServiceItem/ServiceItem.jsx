import React, { useContext, useState } from 'react'
import './ServiceItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const ServiceItem = ({ image, name, price, desc, id, duration, priceType, minimumCharge, tags, availableDaysInWeek, requiresConsultation, category }) => {

    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);
    const [showBookingOverlay, setShowBookingOverlay] = useState(false);
    const [showDetailsOverlay, setShowDetailsOverlay] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        serviceDate: '',
        serviceTime: '',
        address: '',
        specialRequests: ''
    });
    
    // Get current date and time for validation
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentTime = today.getHours() + ':' + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()); // Format: HH:MM

    const handleBookNowClick = (e) => {
        e.stopPropagation();
        setShowBookingOverlay(true);
    };

    const handleItemClick = () => {
        setShowDetailsOverlay(true);
    };

    const closeOverlay = (e) => {
        if (e.target.className === 'overlay') {
            setShowBookingOverlay(false);
            setShowDetailsOverlay(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Special validation for service time when date is today
        if (name === 'serviceTime' && formData.serviceDate === currentDate) {
            const selectedTime = value;
            if (selectedTime < currentTime) {
                alert('Please select a time after the current time.');
                setFormData(prev => ({
                    ...prev,
                    serviceTime: ''
                }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate that selected time is not in the past if date is today
        if (formData.serviceDate === currentDate && formData.serviceTime < currentTime) {
            alert('Please select a service time after the current time.');
            return;
        }
        
        // Add service to cart with the additional information
        addToCart(id, formData);
        // Close the overlay
        setShowBookingOverlay(false);
        // Reset form data
        setFormData({
            customerName: '',
            serviceDate: '',
            serviceTime: '',
            address: '',
            specialRequests: ''
        });
    };

    // Format duration to display in hours and minutes
    const formatDuration = (mins) => {
        if (!mins) return 'Varies';
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        if (hours > 0) {
            return `${hours} ${hours === 1 ? 'hour' : 'hours'}${minutes > 0 ? ` ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : ''}`;
        }
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    };

    // Format price type for display
    const formatPriceType = (type) => {
        if (!type) return '';
        switch(type) {
            case 'fixed': return 'Fixed Price';
            case 'hourly': return 'Per Hour';
            case 'estimate': return 'Estimated Price';
            default: return type;
        }
    };
    
    // Get color styles for price type badges
    const getPriceTypeStyles = (type) => {
        switch(type) {
            case 'fixed':
                return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
            case 'hourly':
                return { backgroundColor: '#e3f2fd', color: '#1976d2' };
            case 'estimate':
                return { backgroundColor: '#fff3e0', color: '#e65100' };
            default:
                return { backgroundColor: '#f0f0f0', color: '#555' };
        }
    };

    return (
        <>
            <div className='service-item' onClick={handleItemClick}>
                <div className='service-item-img-container'>
                    <img className='service-item-image' src={url + "/images/" + image} alt={name} />
                    {!cartItems[id]
                        ? <button className='book-now-btn' onClick={handleBookNowClick}>Book Now</button>
                        : <div className="service-item-counter">
                            <img src={assets.remove_icon_red} onClick={(e) => { e.stopPropagation(); removeFromCart(id); }} alt="Remove" />
                            <p>{cartItems[id]}</p>
                            <img src={assets.add_icon_green} onClick={(e) => { e.stopPropagation(); addToCart(id); }} alt="Add" />
                        </div>
                    }
                </div>
                <div className="service-item-info">
                    <div className="service-item-name-rating">
                        <p>{name}</p> <img src={assets.rating_starts} alt="Rating" />
                    </div>
                    <p className="service-item-desc">{desc}</p>
                    
                    {/* Price information with price type badge */}
                    <div className="service-item-price-container">
                        <p className="service-item-price">Starting from {currency}{price}</p>
                        {priceType && (
                            <span 
                                className="service-price-type" 
                                style={getPriceTypeStyles(priceType)}
                            >
                                {formatPriceType(priceType)}
                            </span>
                        )}
                    </div>
                    
                    {/* Consultation badge if required */}
                    {requiresConsultation && (
                        <div className="service-consultation-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            Consultation Required
                        </div>
                    )}
                </div>
            </div>

            {/* Service Details Overlay */}
            {showDetailsOverlay && (
                <div className="overlay" onClick={closeOverlay}>
                    <div className="service-details-container">
                        <div className="service-details-header">
                            <h2>{name}</h2>
                            <button 
                                className="close-button" 
                                onClick={(e) => { e.stopPropagation(); setShowDetailsOverlay(false); }}
                            >
                                &times;
                            </button>
                        </div>
                        
                        <div className="service-details-image-container">
                            <img src={url + "/images/" + image} alt={name} />
                        </div>
                        
                        <div className="service-details-content">
                            <div className="service-details-section">
                                <h3>Description</h3>
                                <p>{desc}</p>
                            </div>
                            
                            <div className="service-details-info">
                                <div className="service-details-item">
                                    <span className="service-details-label">Price:</span>
                                    <span className="service-details-value">{currency}{price}</span>
                                    {priceType && (
                                        <span 
                                            className="service-details-price-type"
                                            style={getPriceTypeStyles(priceType)}
                                        >
                                            {formatPriceType(priceType)}
                                        </span>
                                    )}
                                </div>
                                
                                {minimumCharge && (
                                    <div className="service-details-item">
                                        <span className="service-details-label">Minimum Charge:</span>
                                        <span className="service-details-value">{currency}{minimumCharge}</span>
                                    </div>
                                )}
                                
                                <div className="service-details-item">
                                    <span className="service-details-label">Duration:</span>
                                    <span className="service-details-value">{formatDuration(duration)}</span>
                                </div>
                                
                                {category && (
                                    <div className="service-details-item">
                                        <span className="service-details-label">Category:</span>
                                        <span className="service-details-value">{category}</span>
                                    </div>
                                )}
                                
                                {requiresConsultation && (
                                    <div className="service-details-item consultation-note">
                                        <div 
                                            className="consultation-badge"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 15px',
                                                backgroundColor: '#fff3e0',
                                                border: '1px solid #ffe0b2',
                                                borderRadius: '8px',
                                                color: '#e65100',
                                                fontWeight: '500'
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                            </svg>
                                            This service requires an initial consultation
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {availableDaysInWeek && availableDaysInWeek.length > 0 && (
                                <div className="service-details-section">
                                    <h3>Available Days</h3>
                                    <div className="service-days-list">
                                        {availableDaysInWeek.map(day => (
                                            <span key={day} className="service-day-tag">{day}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {tags && tags.length > 0 && (
                                <div className="service-details-section">
                                    <h3>Tags</h3>
                                    <div className="service-tags-list">
                                        {tags.map(tag => (
                                            <span key={tag} className="service-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className="service-details-actions">
                                <button 
                                    className="book-service-button"
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setShowDetailsOverlay(false);
                                        setShowBookingOverlay(true);
                                    }}
                                >
                                    Book This Service
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Form Overlay */}
            {showBookingOverlay && (
                <div className="overlay" onClick={closeOverlay}>
                    <div className="booking-form-container">
                        <h2>Book Service: {name}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="customerName">Your Name</label>
                                <input
                                    type="text"
                                    id="customerName"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="address">Service Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your complete address"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="serviceDate">Preferred Service Date</label>
                                <input
                                    type="date"
                                    id="serviceDate"
                                    name="serviceDate"
                                    value={formData.serviceDate}
                                    min={currentDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="serviceTime">Preferred Service Time</label>
                                <input
                                    type="time"
                                    id="serviceTime"
                                    name="serviceTime"
                                    value={formData.serviceTime}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formData.serviceDate === currentDate && (
                                    <small className="time-note">Note: For today's booking, please select a time after {currentTime}</small>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="specialRequests">Special Instructions</label>
                                <textarea
                                    id="specialRequests"
                                    name="specialRequests"
                                    value={formData.specialRequests}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Any specific requirements or details about the service needed"
                                ></textarea>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowBookingOverlay(false)}>Cancel</button>
                                <button type="submit">Book Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default ServiceItem