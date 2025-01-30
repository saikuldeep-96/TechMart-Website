import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import LoginSignup from "./loginSignup";
import Products from "./products";
import Laptops from "./laptops";
import Mobiles from "./mobiles";
// import ProductDetails from "./productDetails"; 
// import Cart from "./cart";
// import Checkout from "./checkout"; 
// import Payment from "./payment"; 
// import Orders from "./orders"; 
// import AdminDashboard from "./admin";                /updated routes and added laptops and products pages/
//


function App() {     {/* Routes updated */}
  return (
    <Router>                   
      <div className="App">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login-signup" element={<LoginSignup />} />
          <Route path="/products" element={<Products />} />
          <Route path="/laptops" element={<Laptops />} />
          <Route path="/mobiles" element={<Mobiles />} />
          

        </Routes>
      </div>
    </Router>
  );
}

export default App;
