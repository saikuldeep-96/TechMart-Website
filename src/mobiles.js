import React from 'react';
import './mobiles.css';

const ProductsPage = () => {
    return (
        <div className="products-page">
          
            <header className="header">
                <div className="container">
                    <div className="logo">
                        <h1>TechMart</h1>
                    </div>
                    <nav>
                        <ul className="nav-links">
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Deal Zone</a></li>
                            <li><a href="#">Services</a></li>
                            <li><a href="#">Blogs</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </nav>
                    <div className="auth-buttons">
                        <button className="logout-btn">Logout</button>
                        <button className="cart-btn">Cart (0)</button>
                    </div>
                </div>
            </header>

            <section className="search-bar">
                <div className="container">
                    <input type="text" placeholder="Search for products..." />
                    <button>Search</button>
                </div>
            </section>

          
            <section className="products-list">
                <div className="container">
                    <h2>Our Products</h2>
                    <div className="product-grid">
                        <div className="product-card">
                            <img src="images/iphone.jpg" alt="iPhone 15 Pro" />
                            <h3>iPhone 15 Pro</h3>
                            <p>$1099</p>
                            <button>Add to Cart</button>
                        </div>
                        <div className="product-card">
                            <img src="images/redmi.jpg" alt="Redmi Note 14" />
                            <h3>Redmi Note 14</h3>
                            <p>$699</p>
                            <button>Add to Cart</button>
                        </div>
                        <div className="product-card">
                            <img src="images/samsung.jpg" alt="Samsung Ultra 24" />
                            <h3>Samsung Ultra 24</h3>
                            <p>$1299</p>
                            <button>Add to Cart</button>
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

export default ProductsPage;
