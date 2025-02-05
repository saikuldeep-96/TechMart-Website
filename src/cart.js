import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, set } from "firebase/database";  // Firebase functions
import "./cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);                                // updated with database and cart functionality

  // Fetch cart data from Firebase when component mounts
  useEffect(() => {
    const fetchCart = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;  // Get the user ID
        const db = getDatabase();
        const cartRef = ref(db, `carts/${userId}`);
        
        try {
          const snapshot = await get(cartRef);
          if (snapshot.exists()) {
            const cartData = snapshot.val();
            const cartItems = Object.values(cartData);  // Convert object to array
            setCart(cartItems);
          } else {
            console.log("No cart data found.");
          }
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      } else {
        console.log("No user is logged in.");
      }
    };

    fetchCart();
  }, []);  // Empty dependency array ensures it runs only once on component mount

  // Update quantity for a specific item
  const updateQuantity = (id, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );

    // Update the cart in Firebase after updating locally
    const user = getAuth().currentUser;
    if (user) {
      const userId = user.uid;
      const db = getDatabase();
      set(ref(db, `carts/${userId}`), cart);  // Update cart data in Firebase
    }
  };

  // Remove item from the cart
  const removeItem = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      // Update the cart in Firebase after removing an item
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const db = getDatabase();
        set(ref(db, `carts/${userId}`), updatedCart);  // Update cart data in Firebase
      }
      return updatedCart;
    });
  };

  // Calculate total price of items in the cart
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-app">
      <header className="cart-header">
        <div className="container">
          <div className="logo">
            <h1>TechMart</h1>
          </div>
          <nav>
            <ul className="cart-nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="#">Services</Link></li>
              <li><Link to="#">Blogs</Link></li>
              <li><Link to="#">Contact Us</Link></li>
            </ul>
          </nav>
          <div className="auth-buttons">
            <Link to="/"><button className="new-login-btn">Logout</button></Link>
            <Link to="/profile"><button className="new-login-btn">User Profile</button></Link>
            <Link to="/order-history"><button className="new-login-btn">Orders</button></Link>
            <div className="cart-icon">
              <Link to="/cart"><FaShoppingCart size={40} /></Link>
            </div>
          </div>
        </div>
      </header>

      <section className="cart-container">
        <div className="container">
          <h2 className="cart-title">Your Shopping Cart</h2>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>${item.price}</p>
                  <div className="cart-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="cart-remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="cart-total-price">
            Total: ${totalPrice.toFixed(2)}
          </div>
          <div className="checkout-btn-container">
            <Link to="/checkout"><button className="cart-checkout-btn">Proceed to Checkout</button></Link>
          </div>
        </div>
      </section>

      <footer className="cart-footer">
        <p>&copy; 2025 TechMart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Cart;
