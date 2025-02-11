import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";  // Import for navigation
import "./uOrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Initialize navigation

  useEffect(() => {
    const fetchOrders = () => {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const db = getDatabase();
        const ordersRef = ref(db, `orders/${userId}`);

        onValue(ordersRef, (snapshot) => {
          if (snapshot.exists()) {
            const ordersData = snapshot.val();
            console.log("Fetched orders:", ordersData);

            const ordersArray = Object.entries(ordersData).map(([orderId, order]) => ({
              orderId,
              ...order,
            }));

            setOrders(ordersArray);
          } else {
            console.log("No orders found for the user");
            setOrders([]);
          }

          setLoading(false);
        });
      }
    };

    fetchOrders();

    return () => {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const db = getDatabase();
        const ordersRef = ref(db, `orders/${userId}`);
        off(ordersRef);
      }
    };
  }, []);

  useEffect(() => {
    console.log("Orders state:", orders);
  }, [orders]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="order-history-container">
      <h2>Your Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-grid">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <h3>Order ID: {order.orderId}</h3>
              <p>Status: {order.status}</p>
              <p>Total: ${order.total.toFixed(2)}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
              <p>Customer Email: {order.userDetails.email}</p>
              <p>Customer ID: {order.userDetails.userId}</p>
              <div>
                <h4>Products:</h4>
                <ul>
                  {order.products.map((product, i) => (
                    <li key={i}>
                      {product.name} - ${product.price} x {product.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Centered Button to Redirect to Products Page */}
      <div className="shop-more-container">
        <button onClick={() => navigate("/products")} className="shop-more-btn">
          Back to Products
        </button>
      </div>
    </div>
  );
};

export default OrderHistory;
