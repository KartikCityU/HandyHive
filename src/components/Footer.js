// src/components/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          {/* Left Side: Contact Information */}
          <Col md={6} className="contact-col">
            <p className="text">Contact Us: info@yourcompany.com</p>
            <p className="text">Phone: +123 456 7890</p>
          </Col>

          {/* Right Side: Social Media Links */}
          <Col md={6} className="social-col">
            <p className="text">Follow Us:</p>
            <div className="social-icons">
              <a href="https://facebook.com" className="social-icon-link" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="social-icon" />
              </a>
              <a href="https://twitter.com" className="social-icon-link" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="social-icon" />
              </a>
              <a href="https://linkedin.com" className="social-icon-link" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="social-icon" />
              </a>
              <a href="https://instagram.com" className="social-icon-link" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="social-icon" />
              </a>
            </div>
          </Col>
        </Row>

        {/* Bottom Text */}
        <Row>
          <Col>
            <p className="text">&copy; 2025 Your Company Name. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
