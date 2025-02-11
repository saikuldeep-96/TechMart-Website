import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import "./checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const db = getDatabase();
      const cartRef = ref(db, `carts/${user.uid}`);
      
      get(cartRef).then((snapshot) => {
        if (snapshot.exists()) {
          const cartData = snapshot.val();
          const cartItems = Object.values(cartData);
          setCart(cartItems);
          setTotalPrice(cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0));
        }
      });

      setCustomer((prev) => ({
        ...prev,
        name: user.displayName || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/payment", { state: { customer, totalPrice, cart } });
  };

  return (
    <div className="checkout-container">
      {/* Left Side: Customer Details */}
      <div className="customer-details">
        <h2>Billing Details</h2>
        <form onSubmit={handleSubmit} className="checkout-form">
          <label>Name:</label>
          <input type="text" name="name" value={customer.name} onChange={handleChange} required />

          <label>Address:</label>
          <input type="text" name="address" value={customer.address} onChange={handleChange} required />

          <label>City:</label>
          <input type="text" name="city" value={customer.city} onChange={handleChange} required />

          <label>State:</label>
          <input type="text" name="state" value={customer.state} onChange={handleChange} required />

          <label>Zip Code:</label>
          <input type="text" name="zip" value={customer.zip} onChange={handleChange} required />

          <label>Country:</label>
          <input type="text" name="country" value={customer.country} onChange={handleChange} required />
        </form>
      </div>

      {/* Right Side: Payment Summary */}
      <div className="payment-summary">
        <h2>Order Summary</h2>
        <p className="total-amount">Total: ${totalPrice.toFixed(2)}</p>
        <button type="submit" className="checkout-btn" onClick={handleSubmit}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;
