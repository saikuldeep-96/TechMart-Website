import React, { useState } from 'react';
import './home.css';
import { FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';  

const featuredProducts = [
  { id: 1, name: "iPhone 15 Pro", price: "1099", image: "images/iphone.jpg", category: "mobiles" },
  { id: 2, name: "Redmi Note 14", price: "699", image: "images/redmi.jpg", category: "mobiles" },
  { id: 3, name: "Samsung Ultra 24", price: "1299", image: "images/samsung.jpg", category: "mobiles" },
  { id: 4, name: "Dell XPS 13", price: "1499", image: "images/dell.jpg", category: "laptops" },
  { id: 5, name: "MacBook Air", price: "1299", image: "images/macbook.jpg", category: "laptops" },
  { id: 6, name: "HP Spectre x360", price: "1799", image: "images/hp.jpg", category: "laptops" }
];

const Products = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");


  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false); 
  };


  const filteredProducts = selectedCategory === "all" ? featuredProducts : featuredProducts.filter(product => product.category === selectedCategory);

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
              <li><Link to="/products">Products</Link></li>
              <li><Link to="#">Services</Link></li>
              <li><Link to="#">Blogs</Link></li>
              <li><Link to="#">Contact Us</Link></li>
            </ul>
          </nav>
          <div className="auth-buttons">
            <Link to="/home">
              <button className="login-btn">Logout</button>
            </Link>
            <div className="cart-icon">
              <FaShoppingCart size={40} />
            </div>
          </div>
        </div>
      </header>

      <section className="category-dropdown">
      <div className={`category-dropdown ${isDropdownOpen ? 'open' : ''}`}>
  <button className="category-btn" onClick={toggleDropdown}>
    <FaBars /> Categories
  </button>
  {isDropdownOpen && (
    <div className="dropdown-menu">
      <button onClick={() => handleCategorySelect("mobiles")}>Mobiles</button>
      <button onClick={() => handleCategorySelect("laptops")}>Laptops</button>
      <button onClick={() => handleCategorySelect("all")}>All</button>
    </div>
  )}
</div>
      </section>

      <section className="search-bar">
        <div className="container">
          <input type="text" placeholder="Search for products..." />
          <button>Search</button>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>{selectedCategory === "all" ? "All Products" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}</h2>
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <button>Add to Cart</button>
                </div>
              ))
            ) : (
              <p>No products found in this category.</p>
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

export default Products;
