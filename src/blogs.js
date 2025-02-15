import React from "react";
import "./blogs.css";
import { Link } from "react-router-dom";

const Blogs = () => {
  return (  //
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>TechMart</h1>
          </div>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="#">Products</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="blogs">
        <div className="container">
          <h2>Latest Blogs</h2>
          <div className="blog-list">
            <div className="blog-card">
              <h3>Top 5 Laptops in 2025</h3>
              <p>A detailed comparison of the best laptops of the year.</p>
              <Link to="#">Read More</Link>
            </div>
            <div className="blog-card">
              <h3>Smartphone Trends</h3>
              <p>What to expect in the next generation of smartphones.</p>
              <Link to="#">Read More</Link>
            </div>
            <div className="blog-card">
              <h3>How to Extend Laptop Battery Life</h3>
              <p>Tips and tricks to keep your battery healthy for years.</p>
              <Link to="#">Read More</Link>
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

export default Blogs;
