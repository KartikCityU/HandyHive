import React, { useState } from 'react';
import axios from 'axios';
import './ChatBot.css';
import deepseek from "../../assets/images/deepseek.png.webp"

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! How can I help you today?", sender: "bot" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // DeepSeek API configuration
  const DEEPSEEK_API_KEY = 'sk-7bb4620fb26442e4a868a6bd1d2894c8'; // Replace with your actual API key
  const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const updatedMessages = [...messages, { text: inputText, sender: 'user' }];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);
    
    try {
      // Call DeepSeek API
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: "deepseek-chat", // DeepSeek's chat model
          messages: [
            { 
              role: "system", 
              content: "You are a helpful assistant for a home services company. Provide clear, concise, and helpful responses about booking services, cancellations, and pricing. Be friendly and professional." 
            },
            ...updatedMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant', 
              content: msg.text
            }))
          ],
          max_tokens: 150,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract bot response
      const botResponse = response.data.choices[0].message.content.trim();
      
      // Add bot response to messages
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      setMessages(prev => [...prev, { 
        text: "I'm experiencing some technical difficulties. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
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
            {isLoading && (
              <div className="message bot loading">
                Typing...
              </div>
            )}
          </div>
          
          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading}
            >
              Send
            </button>
          </div>
          
          <div className="chatbot-powered-by">
            <span>Powered by</span>
            <img 
              src={deepseek} 
              alt="DeepSeek Logo" 
              className="deepseek-logo-image" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;