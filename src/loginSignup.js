import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, database } from './firebase'; 
import { ref, set, get, update } from 'firebase/database';
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
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState('');
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]*$/.test(value)) {
      setName(value);
      setNameError('');
    } else {
      setNameError('Name can only contain alphabetic characters.');
    }
  };

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
      const role = email === "admin123@gmail.com" ? "admin" : "Customer";
      await set(ref(database, 'users/' + uid), {
        name: name,
        email: email,
        phone: phone,
        role: role  // Ensure the role is being set correctly
      });
      setSignupSuccess('Registration successful! Please log in.');
      setTimeout(() => {
        navigate("/login-signup");
      }, 3000);
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to save user data. Please try again.");
    }
  };
  
  

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    if (name && signupEmail && signupPassword && phone && !nameError && !phoneError) {
        setIsSubmitting(true);  // Disable the submit button during the process
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
            const user = userCredential.user;
            await registerUser(user.uid, name, signupEmail, phone);
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error: ' + error.message);  
            setIsSubmitting(false);  // Enable the submit button again
        }
    } else {
        alert('Please fill out all fields correctly.');
    }
  };

  const handleSigninSubmit = async () => {
    setIsLoginSubmitting(true);  // Disable the login button during the process
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      console.log('Signed in user:', user);  // Check if the user is authenticated
  
      // Fetch the user data from Firebase
      const userRef = ref(database, 'users/' + user.uid);
      const snapshot = await get(userRef);  // Use get() to fetch the user data
      const userData = snapshot.val();
      
      console.log('User data:', userData);  // Log the retrieved user data
  
      if (userData) {
        // If the user is an admin, navigate to the admin dashboard
        if (userData.role === 'admin') {
          navigate("/admin-dashboard", { state: { username: email } });
        } else {
          // Otherwise, navigate to the products page
          navigate("/products", { state: { username: email } });
        }
      } else {
        // Admin-specific logic: If user data is not found, create it for admin
        if (email === 'admin123@gmail.com') {
          // Predefine admin user data
          const adminData = {
            name: 'Admin',
            email: 'admin123@gmail.com',
            phone: '1234567890',
            role: 'admin'
          };
          
          // Save admin data to Firebase
          await set(ref(database, 'users/' + user.uid), adminData);
          console.log('Admin user data created:', adminData);
          
          // Redirect to admin dashboard after saving the admin data
          navigate("/admin-dashboard", { state: { username: email } });
        } else {
          alert('User data not found. Please ensure the user exists in the database.');
        }
      }
    } catch (error) {
      console.error('Error signing in:', error);
      alert("Error: " + error.message);  
    } finally {
      setIsLoginSubmitting(false); // Enable the button again after submission
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address first.");
      return;
    }
  
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link has been sent to your email.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      alert("Failed to send reset email. Please check your email address.");
    }
  };
  
  
  
  

  return (
    <div className="login-signup-new-page">
      <header className="header-new">
        <div className="container-new">
          <div className="logo-new">
            <h1>TechMart</h1>
          </div>
          <nav>
            <ul className="nav-links-new">
              <li><Link to="/">Home</Link></li>
              <li><Link to="#">Products</Link></li>
              <li><Link to="#">Services</Link></li>
              <li><Link to="#">Blogs</Link></li>
              <li><Link to="#">Contact Us</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="login-signup-form-new">
        <div className="form-box-new">
          <h2>Login to Your Account</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-group-new">
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

            <div className="input-group-new">
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

            <div className="button-group-new">
              <button
                type="button"
                onClick={handleSigninSubmit}
                disabled={isLoginSubmitting}
                className="submit-btn-new"
              >
                {isLoginSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
            <div className="forgot-password-link">
              <button
                className="forgot-password-btn"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>

        <div className="form-box-new">
          <h2>Create an Account</h2>
          <form onSubmit={handleSignupSubmit}>
            <div className="input-group-new">
              <label htmlFor="signup-name">Name</label>
              <input
                type="text"
                id="signup-name"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                required
              />
              {nameError && <p className="error-new">{nameError}</p>}
            </div>

            <div className="input-group-new">
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

            <div className="input-group-new">
              <label htmlFor="signup-phone">Phone Number</label>
              <input
                type="text"
                id="signup-phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
                required
              />
              {phoneError && <p className="error-new">{phoneError}</p>}
            </div>

            <div className="input-group-new">
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

            <div className="button-group-new">
              <button
                type="submit"
                className="submit-btn-new"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Sign Up'}
              </button>
            </div>
          </form>

          {signupSuccess && (
            <div className="success-message-new">{signupSuccess}</div>
          )}
        </div>
      </section>

      <footer className="footer-new">
        <div className="container-new">
          <p>About Us | Terms and Conditions | Privacy Policy | Services @ TechMart Canada, Suite 104, Ontario</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginSignup;
