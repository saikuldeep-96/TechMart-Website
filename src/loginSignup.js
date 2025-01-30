import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from './firebase'; 
import { ref, set } from 'firebase/database';
import './loginSignup.css';

const LoginSignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState('');
  const navigate = useNavigate();

  // Name validation - only letters                                           //updated with form validations and login/signup functionalities
  const handleNameChange = (e) => {             
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
      setNameError('');
    } else {
      setNameError('Name can only contain alphabetic characters.');
    }
  };

  // Phone validation - only numbers
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhone(value);
      setPhoneError('');
    } else {
      setPhoneError('Phone number must contain only digits.');
    }
  };

  const registerUser = async (uid, name, email, phone) => {
    try {
      await set(ref(database, 'users/' + uid), {
        name: name,
        email: email,
        phone: phone,
        role: "Customer" 
      });

      // Add success message to UI
      setSignupSuccess('Registration successful! Please log in.');
      console.log("Success message displayed!");
      
      // Delay navigation for 3 seconds to show the success message
      setTimeout(() => {
        navigate("/login-signup");
      }, 3000); // Wait for 3 seconds before redirecting
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to save user data. Please try again.");
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    
    // Ensure form fields are filled and valid before proceeding
    if (name && signupEmail && signupPassword && phone && !nameError && !phoneError) {
        setIsSubmitting(true);  // Disable the submit button during the process

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
            const user = userCredential.user;
            console.log("User registered:", user); // Log user details for verification

            await registerUser(user.uid, name, signupEmail, phone);

        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error: ' + error.message);  // Show error message
            setIsSubmitting(false);  // Enable the submit button again
        }
    } else {
        alert('Please fill out all fields correctly.');
    }
};

  const handleSigninSubmit = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user is an admin or a regular user and navigate accordingly
      if (email === "admin@gmail.com" && password === "admin123") {
        navigate("/admin-home");
      } else {
        // Navigate to the products page upon successful login for regular users
        navigate("/products", { state: { username: email } });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-signup-page">
      {/* Header Section */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>TechMart</h1>
          </div>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="#">Products</Link></li>
              <li><Link to="#">Services</Link></li>
              <li><Link to="#">Blogs</Link></li>
              <li><Link to="#">Contact Us</Link></li>
            </ul>
          </nav>
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Login and Signup Form Section */}
      <section className="login-signup-form">
        <div className="container form-container">
          {/* Login Form */}
          <div className="form-box">
            <h2>Login to Your Account</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label htmlFor="login-email">Email</label>
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="button-group">
                <button type="button" onClick={handleSigninSubmit} className="submit-btn">Login</button>
              </div>
            </form>
          </div>

          {/* Signup Form */}
          <div className="form-box">
            <h2>Create an Account</h2>
            <form onSubmit={handleSignupSubmit}>
              <div className="input-group">
                <label htmlFor="signup-name">Name</label>
                <input
                  type="text"
                  id="signup-name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Enter your name"
                  required
                />
                {nameError && <p className="error">{nameError}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="signup-email">Email</label>
                <input
                  type="email"
                  id="signup-email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="signup-phone">Phone Number</label>
                <input
                  type="text"
                  id="signup-phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter your phone number"
                  required
                />
                {phoneError && <p className="error">{phoneError}</p>}
              </div>

              <div className="input-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  type="password"
                  id="signup-password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="button-group">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : 'Sign Up'}
                </button>
              </div>
            </form>

            {signupSuccess && (
              <div className="success-message">{signupSuccess}</div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="container">
          <p>About Us | Terms and Conditions | Privacy Policy | Services @ TechMart Canada, Suite 104, Ontario</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginSignup;
