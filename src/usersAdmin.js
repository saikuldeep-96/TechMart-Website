import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, deleteUser } from 'firebase/auth';
import { getDatabase, ref, get, remove } from 'firebase/database';
import './usersAdmin.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getDatabase();
  const auth = getAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from Firebase Database (or Authentication)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Assuming users are stored in a 'users' node in Realtime Database
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const userList = Object.entries(snapshot.val()).map(([id, user]) => ({
          id,
          ...user,
        }));
        setUsers(userList);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await remove(ref(db, `users/${userId}`)); // Delete user from the database
        fetchUsers(); // Re-fetch users list after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="users-page">
      <h2>Users List</h2>
      
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role || "User"}</td>
                  <td>
                    <button className="delete" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersPage;
