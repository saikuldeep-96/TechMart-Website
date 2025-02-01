import React, { useEffect, useState } from "react";
import { auth, database } from "./firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "./uOrderHistory.css";

const OrderHistory = () => {
  const user = auth.currentUser;
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // If no user is logged in, redirect to login page
      navigate("/login-signup");
    } else {
      fetchOrderHistory();
    }
  }, [user, navigate]);

  const fetchOrderHistory = async () => {
    try {
      const orderRef = ref(database, `orders/${user.uid}`);
      const orderSnapshot = await get(orderRef);

      if (orderSnapshot.exists()) {
        const orderData = orderSnapshot.val();
        const ordersArray = Object.keys(orderData).map((key) => ({
          id: key,
          ...orderData[key],
        }));
        setOrders(ordersArray);
      } else {
        setMessage("No orders found.");
      }
    } catch (error) {
      setMessage("Error fetching order history: " + error.message);
    }
  };

  return (
    <div className="order-history-container">
      {/* Header Section */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>TechMart</h1>
          </div>
          <nav>
            <ul className="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="#">Products</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Blogs</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <h2>Order History</h2>
      {message && <p className="message">{message}</p>}

      <div className="orders">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <h3>Order ID: {order.id}</h3>
              <p>Status: {order.status}</p>
              <p>Total: ${order.totalPrice}</p>
              <p>Items: {order.items?.join(", ")}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No orders to display.</p>
        )}
      </div>

      <button className="back-button" onClick={() => navigate("/products")}>Back to Products</button>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <p>About Us | Terms and Conditions | Privacy Policy | Services @ TechMart Canada, Suite 104, Ontario</p>
        </div>
      </footer>
    </div>
  );
};

export default OrderHistory;
