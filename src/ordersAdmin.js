import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import './ordersAdmin.css';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);  
  const db = getDatabase();  

  // Fetch orders from Firebase
  const fetchOrders = async () => {
    setLoading(true); // Set loading to true when fetching
    setError(null); // Reset previous error
    try {
      const ordersRef = ref(db, 'orders');
      const snapshot = await get(ordersRef);
      if (snapshot.exists()) {
        const fetchedOrders = Object.entries(snapshot.val()).flatMap(([userId, userOrders]) =>
          Object.entries(userOrders).map(([orderId, order]) => ({
            userId,
            orderId,
            ...order,
          }))
        );
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

  // Update order status (Pending -> Processed, Processed -> Shipped)
  const updateOrderStatus = async (orderId, userId, status) => {
    try {
      const orderRef = ref(db, `orders/${userId}/${orderId}`);
      await update(orderRef, { status });  // Update the order status in Firebase
      fetchOrders();  // Refresh the order list after updating the status
    } catch (error) {
      console.error("Error updating order status:", error);
      setError('Error updating order status. Please try again later.');
    }
  };

  // Call fetchOrders when the component is mounted
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders-admin-page">
      <h2> Orders Management</h2>

      {/* Loading state */}
      {loading && <p>Loading orders...</p>}

      {/* Error state */}
      {error && <p className="error">{error}</p>}

      {/* Orders Table */}
      {!loading && !error && orders.length > 0 ? (
        <table className="orders-admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Name</th>
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
                <td>{order.userDetails.name}</td>
                <td>
                  {order.products.map((product, index) => (
                    <div key={index}>
                      {product.productId} (Qty: {product.quantity}) - ${product.price * product.quantity}
                    </div>
                  ))}
                </td>
                <td>${order.total}</td>
                <td>{order.status}</td>
                <td>
                  {/* Action buttons */}
                  {order.status === 'Paid' && (
                    <>
                      <button onClick={() => updateOrderStatus(order.orderId, order.userId, 'Processed')}>
                        Mark as Processed
                      </button>
                      <button onClick={() => updateOrderStatus(order.orderId, order.userId, 'Shipped')}>
                        Mark as Shipped
                      </button>
                    </>
                  )}
                  {order.status === 'Processed' && (
                    <button onClick={() => updateOrderStatus(order.orderId, order.userId, 'Shipped')}>
                      Mark as Shipped
                    </button>
                  )}
                  {order.status === 'Shipped' && <button disabled>Order Shipped</button>}
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

export default OrdersAdmin;
