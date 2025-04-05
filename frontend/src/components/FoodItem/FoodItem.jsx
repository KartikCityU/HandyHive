import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id }) => {

    const [itemCount, setItemCount] = useState(0);
    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);
    const [showOverlay, setShowOverlay] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        deliveryDate: '',
        deliveryTime: '',
        specialRequests: ''
    });
    
    // Get current date and time for validation
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const currentTime = today.getHours() + ':' + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()); // Format: HH:MM

    const handleAddIconClick = (e) => {
        e.stopPropagation(); // Prevent event bubbling
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
        
        // Special validation for delivery time when date is today
        if (name === 'deliveryTime' && formData.deliveryDate === currentDate) {
            const selectedTime = value;
            if (selectedTime < currentTime) {
                alert('Please select a time after the current time.');
                // Reset to empty or current time
                setFormData(prev => ({
                    ...prev,
                    deliveryTime: ''
                }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate that selected time is not in the past if date is today
        if (formData.deliveryDate === currentDate && formData.deliveryTime < currentTime) {
            alert('Please select a delivery time after the current time.');
            return;
        }
        
        // Add item to cart with the additional information
        addToCart(id, formData);
        // Close the overlay
        setShowOverlay(false);
        // Reset form data
        setFormData({
            customerName: '',
            deliveryDate: '',
            deliveryTime: '',
            specialRequests: ''
        });
    };

    return (
        <>
            <div className='food-item'>
                <div className='food-item-img-container'>
                    <img className='food-item-image' src={url + "/images/" + image} alt="" />
                    {!cartItems[id]
                        ? <img className='add' onClick={handleAddIconClick} src={assets.add_icon_white} alt="" />
                        : <div className="food-item-counter">
                            <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="" />
                            <p>{cartItems[id]}</p>
                            <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="" />
                        </div>
                    }
                </div>
                <div className="food-item-info">
                    <div className="food-item-name-rating">
                        <p>{name}</p> <img src={assets.rating_starts} alt="" />
                    </div>
                    <p className="food-item-desc">{desc}</p>
                    <p className="food-item-price">{currency}{price}</p>
                </div>
            </div>

            {showOverlay && (
                <div className="overlay" onClick={closeOverlay}>
                    <div className="order-form-container">
                        <h2>Order Details for {name}</h2>
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
                                <label htmlFor="deliveryDate">Preferred Delivery Date</label>
                                <input
                                    type="date"
                                    id="deliveryDate"
                                    name="deliveryDate"
                                    value={formData.deliveryDate}
                                    min={currentDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="deliveryTime">Preferred Delivery Time</label>
                                <input
                                    type="time"
                                    id="deliveryTime"
                                    name="deliveryTime"
                                    value={formData.deliveryTime}
                                    onChange={handleInputChange}
                                    required
                                />
                                {formData.deliveryDate === currentDate && (
                                    <small className="time-note">Note: For today's delivery, please select a time after {currentTime}</small>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="specialRequests">Special Requests</label>
                                <textarea
                                    id="specialRequests"
                                    name="specialRequests"
                                    value={formData.specialRequests}
                                    onChange={handleInputChange}
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowOverlay(false)}>Cancel</button>
                                <button type="submit">Add to Cart</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default FoodItem