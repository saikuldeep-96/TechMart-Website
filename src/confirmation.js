import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./confirmation.css";

const ConfirmationPage = () => {
  const location = useLocation();
  const total = location.state?.total || 0;

  return (
    <div className="confirmation-container">
      <h2>Payment Successful!</h2>
      <p>Your payment of ${total} has been processed.</p>
      <Link to="/">Go to Homepage</Link>
    </div>
  );
};

export default ConfirmationPage;
