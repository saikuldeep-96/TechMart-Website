import React from "react";
import "./services.css";
import { Link } from "react-router-dom";

const Services = () => {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>TechMart</h1>
          </div>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="#">Products</Link></li> //
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="service-list">
            <div className="service-card">
              <h3>Product Repairs</h3>
              <p>We offer repair services for all mobile and laptop brands.</p>
            </div>
            <div className="service-card">
              <h3>Device Upgrades</h3>
              <p>Upgrade your device with the latest hardware and software.</p>
            </div>
            <div className="service-card">
              <h3>Technical Support</h3>
              <p>24/7 support for any technical issues related to our products.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>About Us | Terms and Conditions | Privacy Policy | Services @ TechMart Canada, Suite 104, Ontario</p>
        </div>
      </footer>
    </div>
  );
};

export default Services;
