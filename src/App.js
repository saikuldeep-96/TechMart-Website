import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import LoginSignup from "./loginSignup";
import Products from "./products";
import Profile from "./profile";
import Laptops from "./laptops";
import Mobiles from "./mobiles";
import Cart from "./cart";
import OrderHistory from "./uOrderHistory";
import Checkout from "./checkout";// added
import PaymentPage from "./payment";// added
import ConfirmationPage from "./confirmation";// added

import AdminDashboard from "./adminDashboard";      
import UsersPage from "./usersAdmin";// added
import OrdersPage from "./ordersAdmin";// added
import CategoryPage from "./categoryAdmin";// added

const stripePromise = loadStripe("pk_test_51QoxkWJ8OGc89FDAurmplBqDO88rFXenomBag0whkwU7AvbGMpFFQlwput0xdIUut6NZsaBMb0L0ezY34QEhxS1u00Xup12hUj");

function App() {
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

          <Route 
            path="/payment" 
            element={
              <Elements stripe={stripePromise}>
                <PaymentPage />
              </Elements>
            } 
          />

          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/usersAdmin" element={<UsersPage />} />
          <Route path="/ordersAdmin" element={<OrdersPage />} />
          <Route path="/categoryAdmin" element={<CategoryPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
