import React, { useState, useEffect } from "react";
import { updatePassword, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth, database } from "./firebase";
import { ref, update, get } from "firebase/database";
import { useNavigate } from "react-router-dom";                             // updated with details fetching and updating details
import "./profile.css";

const UpdateProfile = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); 
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setName(data.name || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !phone || !address) {
      setMessage("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      await updateProfile(user, { displayName: name });

      await update(ref(database, `users/${user.uid}`), {
        name,
        phone,
        address,
      });

      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(`Error updating profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!currentPassword || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, password);
      setMessage("Password updated successfully!");
    } catch (error) {
      setMessage(`Error updating password: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Update Profile</h2>
      {message && <p className="message">{message}</p>}

      <div className="form-container">
        <div className="profile-form">
          <form onSubmit={handleProfileUpdate}>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
            <label>Phone Number:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="Enter your phone number"
            />
            <label>Address:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter your address"
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        <div className="password-form">
          <h3>Change Password</h3>
          <form onSubmit={handlePasswordUpdate}>
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter current password"
            />
            <label>New Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>

      <button className="back-button" onClick={() => navigate("/products")}>Back to Products</button>
    </div>
  );
};

export default UpdateProfile;
