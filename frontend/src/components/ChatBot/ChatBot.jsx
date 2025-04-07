import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! How can I help you today?", sender: "bot" }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    setMessages([...messages, { text: inputText, sender: 'user' }]);
    
    // Process response (Simple pre-defined responses)
    setTimeout(() => {
      let botResponse = "I'm sorry, I don't understand. Could you try asking something else?";
      
      const userInput = inputText.toLowerCase();
      if (userInput.includes('book') || userInput.includes('service')) {
        botResponse = "To book a service, simply browse our services, select the one you need, and click 'Book Now'.";
      } else if (userInput.includes('cancel')) {
        botResponse = "You can cancel a booking by going to 'My Bookings' and selecting the cancel option.";
      } else if (userInput.includes('price') || userInput.includes('cost')) {
        botResponse = "Prices vary depending on the service. You can see the price for each service on its details page.";
      } else if (userInput.includes('hello') || userInput.includes('hi')) {
        botResponse = "Hello! How can I assist you with our home services today?";
      }
      
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 500);
    
    setInputText('');
  };

  return (
    <div className="chatbot-container">
      {!isOpen ? (
        <button 
          className="chatbot-button" 
          onClick={() => setIsOpen(true)}
        >
          Chat with us
        </button>
      ) : (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <h3>Help Assistant</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          
          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;