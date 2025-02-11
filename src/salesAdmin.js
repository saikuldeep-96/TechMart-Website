import React, { useState } from "react";
import { getDatabase, ref, get, query, orderByChild, startAt, endAt } from "firebase/database";
import "./salesAdmin.css";

const SalesReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orders, setOrders] = useState([]);
  
  const fetchSalesReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select a date range.");
      return;
    }
  
    const db = getDatabase();
    const ordersRef = ref(db, "orders");
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
  
    try {
      const snapshot = await get(ordersRef);
      if (snapshot.exists()) {
        const allOrders = snapshot.val();
        let filteredOrders = [];
  
        Object.keys(allOrders).forEach(userId => {
          Object.values(allOrders[userId]).forEach(order => {
            if (order.orderDate >= startTimestamp && order.orderDate <= endTimestamp) {
              filteredOrders.push(order);
            }
          });
        });
  
        setOrders(filteredOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching sales report:", error);
    }
  };
  

  const exportCSV = () => {
    const csvContent = "Order ID, Total, Date, Status\n" + orders.map(order =>
      `${order.orderId}, $${order.total}, ${new Date(order.orderDate).toLocaleString()}, ${order.status}`
    ).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_report.csv";
    a.click();
  };

  return (
    <div className="sales-report-container">
      <h2>Sales Report</h2>
      <div className="filters">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <button onClick={fetchSalesReport}>Generate Report</button>
      </div>

      {orders.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.orderId}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={exportCSV}>Export as CSV</button>
        </>
      )}
    </div>
  );
};

export default SalesReport;
