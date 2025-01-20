// src/components/Home.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaPlug, FaShower, FaCar, FaCut, FaBroom, FaFan } from 'react-icons/fa';

const Home = () => {
  return (
    <Container>
      {/* Separate container for h1 with different background color */}
      {/* <div className="heading-container">
        
      </div> */}
      <h1 className="my-4">Home services at your doorstep !</h1>
      <Row className="my-row">
        {/* Electrician Service */}
        <Col md={4} className="mb-4">
          <Card className="service-card">
            <Card.Body>
              <Card.Title><FaPlug /> Electrician</Card.Title>
              <Card.Text>Professional electrical services for your home.</Card.Text>
              <Button variant="primary" block>Hire Now</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Plumber Service */}
        <Col md={4} className="mb-4">
          <Card className="service-card">
            <Card.Body>
              <Card.Title><FaShower /> Plumber</Card.Title>
              <Card.Text>Reliable plumbing services for all your needs.</Card.Text>
              <Button variant="primary" block>Hire Now</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Driver Service */}
        <Col md={4} className="mb-4">
          <Card className="service-card">
            <Card.Body>
              <Card.Title><FaCar /> Driver</Card.Title>
              <Card.Text>Experienced drivers for your transportation needs.</Card.Text>
              <Button variant="primary" block>Hire Now</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Hairdresser Service */}
        <Col md={4} className="mb-4">
          <Card className="service-card">
            <Card.Body>
              <Card.Title><FaCut /> Hairdresser</Card.Title>
              <Card.Text>Get a professional haircut and styling services at home.</Card.Text>
              <Button variant="primary" block>Hire Now</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* House Cleaning Service */}
        <Col md={4} className="mb-4">
          <Card className="service-card">
            <Card.Body>
              <Card.Title><FaBroom /> House Cleaning</Card.Title>
              <Card.Text>Expert cleaners to make your home spotless.</Card.Text>
              <Button variant="primary" block>Hire Now</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* AC Repair Service */}
        <Col md={4} className="mb-4">
          <Card className="service-card">
            <Card.Body>
              <Card.Title><FaFan /> AC Repair</Card.Title>
              <Card.Text>Professional AC repair services to keep your home cool.</Card.Text>
              <Button variant="primary" block>Hire Now</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

