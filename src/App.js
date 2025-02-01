import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import LoginSignup from "./loginSignup";
import Products from "./products";
import Profile from "./profile";
import Laptops from "./laptops";
import Mobiles from "./mobiles";
import Cart from "./cart";
import AdminDashboard from "./adminDashboard";
import OrderHistory from "./uOrderHistory";

// import ProductDetails from "./productDetails"; 
// import Checkout from "./checkout"; 
// import Payment from "./payment"; 
// import Orders from "./orders"; 
//                /updated routes and added admindashboard, orderhistory, cart,  pages/



function App() {     {/* Routes updated */}
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

          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          

        </Routes>
      </div>
    </Router>
  );
}

export default App;
