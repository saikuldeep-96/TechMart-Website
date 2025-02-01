import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, get, set, push, remove } from 'firebase/database'; // For Realtime Database
import './adminDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();  
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const db = getDatabase();  // Initialize Firebase Database instance

  const adminUsers = ['admin123@gmail.com']; // Replace with actual admin email/UID

  const checkAdmin = () => {
    const user = getAuth().currentUser;
    if (user && !adminUsers.includes(user.email)) {
      alert('You are not authorized to view this page.');
      window.location.href = '/';  // Redirect to homepage if not admin
    }
  };

  useEffect(() => {
    checkAdmin();
    fetchProducts();
  }, []);

  // Fetch products from Firebase
  const fetchProducts = async () => {
    try {
      const productsRef = ref(db, 'products');
      const snapshot = await get(productsRef);
      if (snapshot.exists()) {
        const productList = Object.entries(snapshot.val()).map(([id, data]) => ({
          id,
          ...data,
        }));
        console.log("Fetched products:", productList);  // Ensure products are fetched
        setProducts(productList);  // Update the products state
      } else {
        console.log("No products found in database.");
        setProducts([]); // If no products, clear the list
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out successfully");
        navigate("/"); // Redirect to the homepage
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const productsRef = ref(db, 'products');
      const newProductRef = push(productsRef);
      await set(newProductRef, newProduct);

      setNewProduct({ name: '', price: '', description: '' });
      fetchProducts();  // Refresh product list
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await remove(ref(db, `products/${productId}`));
      fetchProducts();  // Re-fetch products after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>TechMart</h1>
          </div>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="#">Services</Link></li>
              <li><Link to="#">Blogs</Link></li>
              <li><Link to="#">Contact Us</Link></li>
            </ul>
          </nav>

          <div className="auth-buttons">
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="sidebar">
        <h3>Admin Dashboard</h3>
        <ul>
          <li>Products</li>
          <li>Users</li>
          <li>Sales</li>
          <li>Inventory</li>
          <li>Orders</li>
          <li>Category</li>
        </ul>
      </div>

      <div className="content">
        {/* Product List - Displayed at the top */}
        <div className="product-list">
          <h2>Product List</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td>{product.description}</td>
                    <td>
                      <button className="delete" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No products available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Product Form */}
        <div className="add-product">
          <h2>Add Product</h2>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <button onClick={handleAddProduct}>Add Product</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
