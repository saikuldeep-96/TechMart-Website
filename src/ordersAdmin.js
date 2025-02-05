import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import './ordersAdmin.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);  // Track error state
  const db = getDatabase();  // Initialize Firebase Realtime Database instance

  // Function to fetch orders from Firebase
  const fetchOrders = async () => {
    setLoading(true); // Set loading to true when fetching
    setError(null); // Reset previous error
    try {
      const ordersRef = ref(db, 'orders');
      const snapshot = await get(ordersRef);
      if (snapshot.exists()) {
        const fetchedOrders = Object.entries(snapshot.val()).map(([orderId, order]) => ({
          orderId,
          ...order,
        }));
        setOrders(fetchedOrders);  // Set orders in state
      } else {
        setOrders([]);  // If no orders exist, set empty array
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError('Error fetching orders. Please try again later.');
    } finally {
      setLoading(false); // Stop loading after fetching is done
    }
  };

  // Function to update the order status to "Processed" or "Shipped"
  const updateOrderStatus = async (orderId, status) => {
    try {
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, { status });  // Update the order status in Firebase
      fetchOrders();  // Refresh the order list after updating the status
    } catch (error) {
      console.error("Error updating order status:", error);
      setError('Error updating order status. Please try again later.');
    }
  };

  // Function to fetch the order details (optional, if you need more info about an order)
  const fetchOrderDetails = async (orderId) => {
    try {
      const orderRef = ref(db, `orders/${orderId}`);
      const snapshot = await get(orderRef);
      if (snapshot.exists()) {
        return snapshot.val();  // Return the order details
      } else {
        setError('Order not found.');
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError('Error fetching order details. Please try again later.');
    }
  };

  // Call fetchOrders when the component is mounted
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h2>Order Management</h2>

      {/* Loading state */}
      {loading && <p>Loading orders...</p>}

      {/* Error state */}
      {error && <p className="error">{error}</p>}

      {/* Orders Table */}
      {!loading && !error && orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.customerName}</td>
                <td>
                  {order.products.map((product, index) => (
                    <div key={index}>
                      {product.productId} (Qty: {product.quantity})
                    </div>
                  ))}
                </td>
                <td>${order.totalAmount}</td>
                <td>{order.status}</td>
                <td>
                  {/* Action buttons only visible if the order status is "Pending" */}
                  {order.status === 'Pending' ? (
                    <>
                      <button onClick={() => updateOrderStatus(order.orderId, 'Processed')}>Mark as Processed</button>
                      <button onClick={() => updateOrderStatus(order.orderId, 'Shipped')}>Mark as Shipped</button>
                    </>
                  ) : (
                    <button disabled>Processed</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders available.</p>
      )}
    </div>
  );
};

export default OrdersPage;
