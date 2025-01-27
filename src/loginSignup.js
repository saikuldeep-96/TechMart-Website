import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';




function loginSignup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (email === "user1927@gmail.com" && password === "user1927") {
          navigate("/admin-home");
        } else {
          navigate("/home", { state: { username: email } });
        }
      } catch (error) {
        console.error('Error signing in:', error.message);
        alert("Invalid email or password. Please try again.");
      }
    };
  
    const handleSignup = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error(error.message);
      }
    };
  
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Account</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded p-2 mb-2 w-full"
        />
        <div className="flex gap-2">
          <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
          <button onClick={handleSignup} className="bg-green-500 text-white px-4 py-2 rounded">Sign Up</button>
        </div>
      </div>
    );
  }

  export default loginSignup;