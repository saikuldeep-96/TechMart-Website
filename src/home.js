import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';

const featuredProducts = [
  { id: 1, name: "iPhone 15 Pro", price: "1099", image: "images/iphone.jpg" },
  { id: 2, name: "Redmi Note 14", price: "699", image: "images/redmi.jpg" },
  { id: 3, name: "Samsung Ultra 24", price: "1299", image: "images/samsung.jpg" }
];

function Home() {
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
              <li><Link to="#">Products</Link></li>
              <li><Link to="#">Services</Link></li>
              <li><Link to="#">Blogs</Link></li>
              <li><Link to="#">Contact Us</Link></li>  
            </ul>
          </nav>
          <div className="auth-buttons">
            <Link to="/login-signup">
              <button className="login-btn">Login</button>  
            </Link>

          </div>
        </div>
      </header>

      <section className="search-bar">
        <div className="container">
          <input type="text" placeholder="Search for products..." />
          <button>Search</button>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="product-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <button>Add to Cart</button>
                </div>
              ))
            ) : (
              <p>Loading products...</p>
            )}
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
}

export default Home;
