import React, { useState } from 'react'
import './AboutContact.css'
import { toast } from 'react-toastify';
import homeservice from "../../assets/homeservice.png"

const AboutContact = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Thank you for your message! We'll get back to you soon.");
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="about-contact-container">
      <div className="page-header">
        <h1>About Us</h1>
        <p>Learn about HandyHive and get in touch with us</p>
      </div>

      {/* About Us Section */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              HandyHive is your one-stop platform for professional home services. We connect homeowners with skilled service providers who can handle everything from plumbing and electrical work to cleaning and landscaping.
            </p>
            <p>
              Founded in 2025, we've grown from a small startup to a trusted platform serving thousands of customers. Our mission is to make home maintenance and improvement accessible, affordable, and hassle-free.
            </p>

            <h3>Our Values</h3>
            <div className="values-container">
              <div className="value-card">
                <h4>Quality</h4>
                <p>We thoroughly vet all service providers to ensure they meet our high standards.</p>
              </div>
              <div className="value-card">
                <h4>Reliability</h4>
                <p>Punctuality and dependability are core to our service promise.</p>
              </div>
              <div className="value-card">
                <h4>Transparency</h4>
                <p>Clear communication and upfront pricing are fundamental to our approach.</p>
              </div>
              <div className="value-card">
                <h4>Customer-First</h4>
                <p>Your satisfaction drives everything we do, from service selection to completion.</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src= {homeservice} alt="HandyHive Team" />
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section" id="contact">
        <h2>Contact Us</h2>
        
        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-card">
              <div className="icon-circle">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Our Location</h3>
              <p>123 Service Avenue</p>
              <p>Suite 100</p>
              <p>New York, NY 10001</p>
            </div>
            
            <div className="contact-card">
              <div className="icon-circle">
                <i className="fas fa-phone-alt"></i>
              </div>
              <h3>Phone</h3>
              <p>Customer Support:</p>
              <p>(123) 456-7890</p>
              <p>Mon-Sun: 8AM - 8PM</p>
            </div>
            
            <div className="contact-card">
              <div className="icon-circle">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email</h3>
              <p>support@handyhive.com</p>
              <p>partners@handyhive.com</p>
              <p>info@handyhive.com</p>
            </div>
            
            <div className="contact-card social-card">
              <div className="icon-circle">
                <i className="fas fa-share-alt"></i>
              </div>
              <h3>Social Media</h3>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
            <h3>Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={contactForm.name}
                  onChange={handleChange}
                  required 
                  placeholder="John Doe"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={contactForm.email}
                    onChange={handleChange}
                    required 
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone (Optional)</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={contactForm.phone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={contactForm.subject}
                  onChange={handleChange}
                  required 
                  placeholder="How can we help you?"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  value={contactForm.message}
                  onChange={handleChange}
                  required 
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}

export default AboutContact