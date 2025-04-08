import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const {url, token, currency} = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.post(url+"/api/order/userorders", {}, {headers:{token}});
      
      // Sort orders by date (newest first)
      const sortedOrders = response.data.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch agent details for a specific order
  const fetchOrderAgent = async (orderId) => {
    try {
      const response = await axios.post(url+"/api/order/order-agent", {
        orderId: orderId
      });
      
      if (response.data.success) {
        // Update the specific order with agent details
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, agentDetails: response.data.agent, hasAgentDetails: true } 
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error fetching agent details:", error);
    }
  };

  // Toggle expanded order view
  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      
      // Fetch agent details if not already fetched
      const order = orders.find(o => o._id === orderId);
      if (order && !order.hasAgentDetails && order.assignedAgentId) {
        fetchOrderAgent(orderId);
      }
    }
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Order Processing':
        return '#f0ad4e'; // Yellow
      case 'Preparing':
        return '#5bc0de'; // Blue
      case 'On the way':
        return '#0275d8'; // Primary blue
      case 'Delivered':
      case 'Completed':
        return '#5cb85c'; // Green
      case 'Cancelled':
        return '#d9534f'; // Red
      default:
        return '#777777'; // Gray
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="loading-orders">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <img src={assets.empty_cart || assets.parcel_icon} alt="No orders" />
          <h3>No orders yet</h3>
          <p>Your order history will appear here once you place an order.</p>
        </div>
      ) : (
        <div className="container">
          {orders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            const statusColor = getStatusColor(order.status);
            
            return (
              <div key={order._id} className={`my-orders-order ${isExpanded ? 'expanded' : ''}`}>
                <div className="order-summary" onClick={() => toggleOrderDetails(order._id)}>
                  <img src={assets.parcel_icon} alt="Order" />
                  <div className="order-items">
                    <p>{order.items.map((item, index) => {
                      if (index === order.items.length-1) {
                        return item.name+" x "+item.quantity
                      } else {
                        return item.name+" x "+item.quantity+", "
                      }
                    })}</p>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <p className="order-amount">{currency}{order.amount.toFixed(2)}</p>
                  <p className="order-items-count">Items: {order.items.length}</p>
                  <p className="order-status">
                    <span style={{color: statusColor}}>&#x25cf;</span> 
                    <b>{order.status}</b>
                  </p>
                  <button className="order-button">
                    {isExpanded ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="order-details">
                    <div className="order-details-section">
                      <h3>Order Details</h3>
                      <p><strong>Order ID:</strong> {order._id}</p>
                      <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <p><strong>Payment:</strong> {order.payment ? 'Paid' : 'Pending'}</p>
                      <p><strong>Amount:</strong> {currency}{order.amount.toFixed(2)}</p>
                      
                      {/* Service details */}
                      {(order.serviceDate || order.deliveryDate) && (
                        <>
                          <p><strong>Service Date:</strong> {order.formattedDate || formatDate(order.serviceDate || order.deliveryDate)}</p>
                          <p><strong>Service Time:</strong> {order.formattedTime || order.serviceTime || order.deliveryTime || 'Not specified'}</p>
                        </>
                      )}
                      
                      {order.specialRequests && (
                        <p><strong>Special Requests:</strong> {order.specialRequests}</p>
                      )}
                    </div>
                    
                    {/* Agent details section */}
                    {order.assignedAgentId && (
                      <div className="order-details-section agent-section">
                        <h3>Assigned Service Partner</h3>
                        {order.hasAgentDetails && order.agentDetails ? (
                          <div className="agent-details">
                            <div className="agent-image">
                              {order.agentProfileImage || (order.agentDetails && order.agentDetails.profileImage) ? (
                                <img 
                                  src={`${url}/images/agents/${order.agentProfileImage || order.agentDetails.profileImage}`} 
                                  alt={order.agentName || order.agentDetails.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.parentNode.innerHTML = `<div class="agent-placeholder">${(order.agentName || order.agentDetails.name)?.charAt(0) || 'A'}</div>`;
                                  }}
                                />
                              ) : (
                                <div className="agent-placeholder">
                                  {(order.agentName || order.agentDetails.name)?.charAt(0) || 'A'}
                                </div>
                              )}
                            </div>
                            <div className="agent-info">
                              <h4>{order.agentName || order.agentDetails.name}</h4>
                              {order.agentDetails.serviceType && (
                                <span className="agent-specialty">{order.agentDetails.serviceType}</span>
                              )}
                              
                              <div className="agent-contact">
                                <p><strong>Email:</strong> {order.agentEmail || order.agentDetails.email}</p>
                                <p><strong>Phone:</strong> {order.agentPhone || order.agentDetails.phone}</p>
                                <p><strong>Experience:</strong> {order.agentDetails.completedServices} services completed</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="basic-agent-info">
                            <p><strong>Name:</strong> {order.agentName || 'Assigned'}</p>
                            {order.agentPhone && <p><strong>Phone:</strong> {order.agentPhone}</p>}
                            {order.agentEmail && <p><strong>Email:</strong> {order.agentEmail}</p>}
                            <button 
                              className="load-agent-details"
                              onClick={(e) => {
                                e.stopPropagation();
                                fetchOrderAgent(order._id);
                              }}
                            >
                              Load Full Partner Details
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Items section */}
                    <div className="order-details-section">
                      <h3>Items Ordered</h3>
                      <div className="order-items-list">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">x {item.quantity}</span>
                            <span className="item-price">{currency}{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="order-item delivery-fee">
                          <span className="item-name">Delivery Fee</span>
                          <span className="item-price">{currency}5.00</span>
                        </div>
                        <div className="order-total">
                          <span>Total</span>
                          <span>{currency}{order.amount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Address section */}
                    {order.address && (
                      <div className="order-details-section">
                        <h3>Delivery Address</h3>
                        <p>
                          {order.address.firstName} {order.address.lastName}<br />
                          {order.address.street}<br />
                          {order.address.city}, {order.address.state} {order.address.zipcode}<br />
                          {order.address.country}<br />
                          <strong>Phone:</strong> {order.address.phone}
                        </p>
                      </div>
                    )}
                    
                    <div className="order-actions">
                      <button onClick={fetchOrders}>Refresh</button>
                      <button onClick={() => toggleOrderDetails(order._id)}>Close Details</button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyOrders