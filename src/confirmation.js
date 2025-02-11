import React from "react";
import { Link } from "react-router-dom";
import "./confirmation.css";

const OrderConfirmation = () => {
  return (
    <div className="confirmation-container">
      <h2>🎉 Order Successful!</h2>
      <p>Thank you for your purchase. Your order has been placed successfully.</p>
      <p>You will receive a confirmation email shortly.</p>
      
      <Link to="/products">
        <button className="continue-shopping-btn">Continue Shopping</button>
      </Link>
    </div>
  );
};

export default OrderConfirmation;
