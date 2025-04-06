import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
      <NavLink to='/add-service' className="sidebar-option">
            <img src={assets.add_icon} alt="" />
            <p>Add Service</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Serivce List</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Orders</p>
        </NavLink>
        <NavLink to='/delivery-agents' className="sidebar-option">
            <img src={assets.delivery_icon || assets.order_icon} alt="" />
            <p>Service Partners</p>
        </NavLink>
       
      </div>
    </div>
  )
}

export default Sidebar