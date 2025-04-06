import React, { useContext, useState } from 'react'
import './ServiceItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const ServiceItem = ({ image, name, price, desc, id }) => {

    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);
    const [showOverlay, setShowOverlay] = useState(false);
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
        setShowOverlay(true);
    };

    const closeOverlay = (e) => {
        if (e.target.className === 'overlay') {
            setShowOverlay(false);
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
        setShowOverlay(false);
        // Reset form data
        setFormData({
            customerName: '',
            serviceDate: '',
            serviceTime: '',
            address: '',
            specialRequests: ''
        });
    };

    return (
        <>
            <div className='service-item'>
                <div className='service-item-img-container'>
                    <img className='service-item-image' src={url + "/images/" + image} alt={name} />
                    {!cartItems[id]
                        ? <button className='book-now-btn' onClick={handleBookNowClick}>Book Now</button>
                        : <div className="service-item-counter">
                            <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="Remove" />
                            <p>{cartItems[id]}</p>
                            <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="Add" />
                        </div>
                    }
                </div>
                <div className="service-item-info">
                    <div className="service-item-name-rating">
                        <p>{name}</p> <img src={assets.rating_starts} alt="Rating" />
                    </div>
                    <p className="service-item-desc">{desc}</p>
                    <p className="service-item-price">Starting from {currency}{price}</p>
                </div>
            </div>

            {showOverlay && (
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
                                <button type="button" onClick={() => setShowOverlay(false)}>Cancel</button>
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