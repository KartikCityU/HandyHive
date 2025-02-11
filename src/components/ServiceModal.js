// src/components/ServiceModal.js
import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { FaStar, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ServiceModal = ({ show, onHide, selectedService }) => {
  const navigate = useNavigate();

  // Dummy data for service providers
  const serviceProviders = {
    Electrician: [
      {
        name: 'John Doe',
        rating: 4.5,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Jane Smith',
        rating: 4.2,
        available: false,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Mike Johnson',
        rating: 4.7,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
    ],
    Plumber: [
      {
        name: 'Alice Brown',
        rating: 4.8,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Bob White',
        rating: 4.1,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Charlie Green',
        rating: 4.3,
        available: false,
        image: 'https://via.placeholder.com/50',
      },
    ],
    Driver: [
      {
        name: 'David Wilson',
        rating: 4.6,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Eva Black',
        rating: 4.4,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Frank Harris',
        rating: 4.0,
        available: false,
        image: 'https://via.placeholder.com/50',
      },
    ],
    Hairdresser: [
      {
        name: 'Grace Lee',
        rating: 4.9,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Hank Miller',
        rating: 4.2,
        available: false,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Ivy Davis',
        rating: 4.7,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
    ],
    'House Cleaning': [
      {
        name: 'Jack Taylor',
        rating: 4.5,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Karen Moore',
        rating: 4.3,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Leo Anderson',
        rating: 4.1,
        available: false,
        image: 'https://via.placeholder.com/50',
      },
    ],
    'AC Repair': [
      {
        name: 'Mia Thomas',
        rating: 4.7,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Noah Jackson',
        rating: 4.0,
        available: false,
        image: 'https://via.placeholder.com/50',
      },
      {
        name: 'Olivia Martin',
        rating: 4.6,
        available: true,
        image: 'https://via.placeholder.com/50',
      },
    ],
  };

  const handleProviderClick = (provider) => {
    if (provider.available) {
      // Navigate to the booking form with provider and service details
      navigate('/book-appointment', {
        state: { providerName: provider.name, serviceType: selectedService },
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{selectedService} Providers</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {serviceProviders[selectedService]?.map((provider, index) => (
            <ListGroup.Item
              key={index}
              className="provider-item"
              onClick={() => handleProviderClick(provider)}
              style={{ cursor: provider.available ? 'pointer' : 'not-allowed' }}
            >
              <div className="provider-info">
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="provider-image"
                />
                <div>
                  <h6 className="provider-name">{provider.name}</h6>
                  <div className="provider-rating">
                    <FaStar className="star-icon" />
                    <span>{provider.rating}</span>
                  </div>
                </div>
              </div>
              <div className="provider-status">
                {provider.available ? (
                  <span className="available">
                    <FaCheck /> Available
                  </span>
                ) : (
                  <span className="unavailable">Unavailable</span>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ServiceModal;