import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {

    const [payment, setPayment] = useState("cod")
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    })

    const { getTotalCartAmount, token, food_list, cartItems, cartItemDetails, url, setCartItems, currency, deliveryCharge } = useContext(StoreContext);

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const placeOrder = async (e) => {
        e.preventDefault()
        let orderItems = [];
        food_list.map(((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                
                // Add form data to the order item if available
                if (cartItemDetails && cartItemDetails[item._id]) {
                    itemInfo["customerName"] = cartItemDetails[item._id].customerName;
                    itemInfo["deliveryDate"] = cartItemDetails[item._id].deliveryDate;
                    itemInfo["deliveryTime"] = cartItemDetails[item._id].deliveryTime;
                    itemInfo["specialRequests"] = cartItemDetails[item._id].specialRequests;
                }
                
                orderItems.push(itemInfo)
            }
        }))
        
        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + deliveryCharge,
            // Add overall customer details from first item's form data if available
            ...(orderItems.length > 0 && orderItems[0].customerName ? {
                customerName: orderItems[0].customerName,
                deliveryDate: orderItems[0].deliveryDate,
                deliveryTime: orderItems[0].deliveryTime,
                specialRequests: orderItems[0].specialRequests
            } : {})
        }
        
        if (payment === "stripe") {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            }
            else {
                toast.error("Something Went Wrong")
            }
        }
        else{
            let response = await axios.post(url + "/api/order/placecod", orderData, { headers: { token } });
            if (response.data.success) {
                navigate("/myorders")
                toast.success(response.data.message)
                setCartItems({});
            }
            else {
                toast.error("Something Went Wrong")
            }
        }
    }
    
    // Display order summary including form data
    const OrderSummary = () => {
        return (
            <div className="order-summary">
                <h2>Order Summary</h2>
                {food_list.map((item) => {
                    if (cartItems[item._id] > 0) {
                        return (
                            <div key={item._id} className="order-item">
                                <div className="order-item-details">
                                    <img src={url + "/images/" + item.image} alt={item.name} />
                                    <div>
                                        <h3>{item.name}</h3>
                                        <p className="quantity">Quantity: {cartItems[item._id]}</p>
                                        <p className="price">{currency}{item.price * cartItems[item._id]}</p>
                                    </div>
                                </div>
                                
                                {cartItemDetails && cartItemDetails[item._id] && (
                                    <div className="order-item-form-data">
                                        <h4>Delivery Details:</h4>
                                        <p><strong>For:</strong> {cartItemDetails[item._id].customerName}</p>
                                        <p><strong>Date:</strong> {new Date(cartItemDetails[item._id].deliveryDate).toLocaleDateString()}</p>
                                        <p><strong>Time:</strong> {cartItemDetails[item._id].deliveryTime}</p>
                                        {cartItemDetails[item._id].specialRequests && (
                                            <p><strong>Special Requests:</strong> {cartItemDetails[item._id].specialRequests}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    }
                    return null;
                })}
            </div>
        )
    }

    useEffect(() => {
        if (!token) {
            toast.error("to place an order sign in first")
            navigate('/cart')
        }
        else if (getTotalCartAmount() === 0) {
            navigate('/cart')
        }
    }, [token])

    return (
        <form onSubmit={placeOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <div className="multi-field">
                    <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
                    <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
                </div>
                <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
                <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
                <div className="multi-field">
                    <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
                    <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
                </div>
                <div className="multi-field">
                    <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
                    <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
                </div>
                <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
                
                {/* Display order summary with form data */}
                <OrderSummary />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{currency}{getTotalCartAmount()}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{currency}{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + deliveryCharge}</b></div>
                    </div>
                </div>
                <div className="payment">
                    <h2>Payment Method</h2>
                    <div onClick={() => setPayment("cod")} className="payment-option">
                        <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
                        <p>COD ( Cash on delivery )</p>
                    </div>
                    <div onClick={() => setPayment("stripe")} className="payment-option">
                        <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
                        <p>Stripe ( Credit / Debit )</p>
                    </div>
                </div>
                <button className='place-order-submit' type='submit'>{payment==="cod"?"Place Order":"Proceed To Payment"}</button>
            </div>
        </form>
    )
}

export default PlaceOrder