import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import AddService from './pages/AddService/AddService' // Import the new AddService component
import DeliveryAgents from './pages/DeliveryAgent/DeliveryAgents'
import AddAgent from './pages/AddAgent/AddAgent'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className='app'>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          {/* Add a default route to redirect to one of your existing pages */}
          <Route path="/" element={<Navigate to="/add-service" />} />
          
          {/* Original routes */}
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/delivery-agents" element={<DeliveryAgents />} />
          <Route path="/add-agent" element={<AddAgent />} />
          
          {/* New routes for services platform */}
          <Route path="/add-service" element={<AddService />} />
          {/* <Route path="/services-list" element={<List />} /> 
          <Route path="/bookings" element={<Orders />} />
          <Route path="/service-partners" element={<DeliveryAgents />} />
          <Route path="/customers" element={<Navigate to="/list" />} /> Placeholder until you have a Customers component */}
        </Routes>
      </div>
    </div>
  )
}

export default App