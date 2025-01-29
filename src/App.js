import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";
import LoginSignup from "./loginSignup";

function App() {     {/* Routes updated */}
  return (
    <Router>                   
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<LoginSignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
