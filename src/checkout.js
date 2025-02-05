import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./checkout.css";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [orderSummary, setOrderSummary] = useState({
    items: [],
    total: 0,
  });

  const auth = getAuth();
  const db = getDatabase();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Fetch the cart data from Firebase
      const cartRef = ref(db, `carts/${user.uid}`);
      get(cartRef).then((snapshot) => {
        if (snapshot.exists()) {
          const cartData = snapshot.val();
          const cartItems = Object.values(cartData);
          setCart(cartItems);

          const totalPrice = cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          );

          setOrderSummary({ items: cartItems, total: totalPrice });
        } else {
          setCart([]);
          setOrderSummary({ items: [], total: 0 });
        }
      });

      // Set the user's display name in the shipping address
      setShippingAddress((prev) => ({
        ...prev,
        name: user.displayName || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order Submitted:", { shippingAddress, cart });
  };

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="container">
          <div className="logo">
            <h1>TechMart</h1>
          </div>
          <nav>
            <ul className="checkout-nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="checkout-container">
        <h2>Checkout</h2>

        <div className="checkout-content">
          {/* Shipping Address Section */}
          <form onSubmit={handleSubmit} className="shipping-form">
            <h3>Shipping Address</h3>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={shippingAddress.name}
              onChange={handleChange}
              readOnly
            />
            <label>Address:</label>
            <input type="text" name="address" value={shippingAddress.address} onChange={handleChange} required />
            <label>City:</label>
            <input type="text" name="city" value={shippingAddress.city} onChange={handleChange} required />
            <label>State:</label>
            <input type="text" name="state" value={shippingAddress.state} onChange={handleChange} required />
            <label>Zip Code:</label>
            <input type="text" name="zip" value={shippingAddress.zip} onChange={handleChange} required />
            <label>Country:</label>
            <input type="text" name="country" value={shippingAddress.country} onChange={handleChange} required />
          </form>

          {/* Order Summary Section */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            {orderSummary.items.length > 0 ? (
              <ul>
                {orderSummary.items.map((item) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity} - ${item.price * item.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items in the cart.</p>
            )}
            <h4>Total: ${orderSummary.total.toFixed(2)}</h4>
            <Link to="/payment">
  <button type="submit" className="checkout-btn">Continue to Payment</button>
</Link>

          </div>
        </div>
      </div>

      <footer className="checkout-footer">
        <div className="container">
          <p>About Us | Terms and Conditions | Privacy Policy | Services @ TechMart Canada</p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
