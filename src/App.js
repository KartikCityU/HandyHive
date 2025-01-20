// src/App.js
import React from 'react';
import NavigationBar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Home />
      <Footer/>
    </div>
  );
}

export default App;
