import React, { useState } from 'react';
import './loginSignup.css'; 
import { Link } from "react-router-dom";

const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true); 

    const handleToggle = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="login-signup-page">        {/* updated with header, navbar and footer as Login/signup Page*/}
           
            <header className="header">
                <div className="container">
                    <div className="logo">
                        <h1>TechMart</h1>
                    </div>
                    <nav>
                        <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
    <li><Link to="#">Deal Zone</Link></li>
    <li><Link to="#">Services</Link></li>
    <li><Link to="#">Blogs</Link></li>
    <li><Link to="#">Contact Us</Link></li>
                        </ul>
                    </nav>
                    <div className="auth-buttons">
                        <button className="login-btn">Login</button>
                        <button className="signup-btn">Sign Up</button>
                    </div>
                </div>
            </header>

           
            <section className="login-signup-form">
                <div className="container">
                    <h2>{isLogin ? 'Login to Your Account' : 'Create an Account'}</h2>

                    <form action="#">
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="Enter your email" required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" placeholder="Enter your password" required />
                        </div>

                        {isLogin ? (
                            <>
                          
                                <div className="button-group">
                                    <button type="submit" className="submit-btn">Login</button>
                                </div>
                            </>
                        ) : (
                            <>
                              
                                <div className="input-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input type="password" id="confirmPassword" placeholder="Confirm your password" required />
                                </div>

                                <div className="button-group">
                                    <button type="submit" className="submit-btn">Sign Up</button>
                                </div>
                            </>
                        )}
                    </form>

                    <div className="toggle-action">
                        <p>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button onClick={handleToggle}>
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <p>About Us | Terms and Conditions | Privacy Policy | Services @ TechMart Canada, Suite 104, Ontario</p>
                </div>
            </footer>
        </div>
    );
};

export default LoginSignup;
