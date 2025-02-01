import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import "./cart.css";

const initialCart = [
  { id: 1, name: "iPhone 15 Pro", price: 1099, image: "images/iphone.jpg", quantity: 1 },
  { id: 2, name: "MacBook Air", price: 1299, image: "images/macbook.jpg", quantity: 1 },
];

const Cart = () => {
  const [cart, setCart] = useState(initialCart);

  const updateQuantity = (id, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item))
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
            <Link to="/">
              <button className="login-btn">Logout</button>
            </Link>
            <Link to="/profile">
              <button className="login-btn">User Profile</button>
            </Link>
            <Link to="/order-history">
              <button className="login-btn">Orders</button>
            </Link>
            <div className="cart-icon">
              <Link to="/cart">
                <FaShoppingCart size={40} />
              </Link>
            </div>
          </div>
        </div>
      </header>


      <section className="cart-container">
        <div className="container">
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-details">
                    <h3>{item.name}</h3>
                    <p>${item.price}</p>
                    <div className="quantity">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <h3 className="total-price">Total: ${totalPrice}</h3>
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

export default Cart;
