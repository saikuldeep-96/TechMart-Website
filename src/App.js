import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getDatabase, ref, get } from "firebase/database";  
import { getAuth } from "firebase/auth";

import "./App.css";
import Home from "./home";
import LoginSignup from "./loginSignup";
import Products from "./products";
import Profile from "./profile";
import Laptops from "./laptops";
import Mobiles from "./mobiles";
import Cart from "./cart";
import OrderHistory from "./uOrderHistory";
import Checkout from "./checkout";
import PaymentPage from "./payment";
import ConfirmationPage from "./confirmation";


import AdminDashboard from "./adminDashboard";      
import UsersPage from "./usersAdmin";
import OrdersPage from "./ordersAdmin";
import CategoryPage from "./categoryAdmin";
import InventoryPage from "./inventory";   //added
import SalesReport from "./salesAdmin";    //added

const stripePromise = loadStripe("pk_test_51QoxkWJ8OGc89FDAurmplBqDO88rFXenomBag0whkwU7AvbGMpFFQlwput0xdIUut6NZsaBMb0L0ezY34QEhxS1u00Xup12hUj");

function App() {
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const fetchCartTotal = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const db = getDatabase();
        const cartRef = ref(db, `carts/${user.uid}`);

        try {
          const snapshot = await get(cartRef);
          if (snapshot.exists()) {
            const cartData = snapshot.val();
            const total = Object.values(cartData).reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            );
            setCartTotal(total);
          } else {
            setCartTotal(0);
          }
        } catch (error) {
          console.error("Error fetching cart total:", error);
        }
      }
    };

    fetchCartTotal();
  }, []);

  return (
    <Router>                   
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-signup" element={<LoginSignup />} />
          <Route path="/products" element={<Products />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/laptops" element={<Laptops />} />
          <Route path="/mobiles" element={<Mobiles />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>

        
        <Elements stripe={stripePromise}>
          <Routes>
            <Route path="/payment" element={<PaymentPage total={cartTotal} />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
          </Routes>
        </Elements>
        

        <Routes>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/usersAdmin" element={<UsersPage />} />
          <Route path="/ordersAdmin" element={<OrdersPage />} />
          <Route path="/categoryAdmin" element={<CategoryPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/salesAdmin" element={<SalesReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
