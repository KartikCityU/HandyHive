import React, { useState } from 'react'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import LoginPopup from './components/LoginPopup/LoginPopup'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import DeliveryAgentsList from './pages/AgentList/DeliveryAgentsList'
import DeliveryAgentDetails from './pages/Agent/DeliveryAgentDetails'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify'

const App = () => {

  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer/>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin}/> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/cart' element={<Cart />}/>
          <Route path='/booking' element={<PlaceOrder />}/>
          <Route path='/my-bookings' element={<MyOrders />}/>
          <Route path='/verify' element={<Verify />}/>
          <Route path="/service-partners" element={<DeliveryAgentsList />} />
          <Route path="/partner/:id" element={<DeliveryAgentDetails />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App