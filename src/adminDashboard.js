import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, get, set, push, remove, update } from 'firebase/database';
import './adminDashboard.css';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [products, setProducts] = useState([]);         // updated with fetching to user home, edit and delete
  const [newProduct, setNewProduct] = useState({
    id: null,
    name: '',
    price: '',
    description: '',
    category: 'mobile',
  });
  const db = getDatabase();

  const adminUsers = ['admin123@gmail.com'];

  const checkAdmin = () => {
    const user = getAuth().currentUser;
    if (user && !adminUsers.includes(user.email)) {
      alert('You are not authorized to view this page.');
      window.location.href = '/';
    }
  };

  useEffect(() => {
    checkAdmin();
    fetchProducts();
  }, []);

  
  const fetchProducts = async () => {
    try {
      const categories = ['mobile', 'laptops'];
      let allProducts = [];

      for (const category of categories) {
        const productsRef = ref(db, `products/categories/${category}`);
        const snapshot = await get(productsRef);

        if (snapshot.exists()) {
          const productList = Object.entries(snapshot.val()).map(([id, product]) => ({
            id,
            ...product,
            category,
          }));
          allProducts = [...allProducts, ...productList]; 
        }
      }

      setProducts(allProducts); 
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User logged out successfully');
        navigate('/');
      })
      .catch((error) => {
        console.error('Error logging out: ', error);
      });
  };

  const handleCategoryChange = (e) => {
    setNewProduct({ ...newProduct, category: e.target.value });
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const category = newProduct.category;
      console.log('Adding/updating product with details:', newProduct);

      const productsRef = ref(db, `products/categories/${category}`);

      if (newProduct.id) {

        const productRef = ref(db, `products/categories/${category}/${newProduct.id}`);
        await update(productRef, {
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
        });
        console.log('Product updated successfully.');
      } else {
        
        const newProductRef = push(productsRef);
        await set(newProductRef, {
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description,
        });
        console.log('New product added successfully.');
      }

      
      setNewProduct({ id: null, name: '', price: '', description: '', category: 'mobile' });
      fetchProducts(); 

    } catch (error) {
      console.error('Error adding or updating product:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleDeleteProduct = async (productId, category) => {
    try {
      console.log('Deleting product...');
      await remove(ref(db, `products/categories/${category}/${productId}`));
      fetchProducts(); 
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    });
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
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="sidebar">
        <h3>Admin Dashboard</h3>
        <ul>
          <li>Products</li>
          <li><Link to="/usersAdmin">Users</Link></li>
          <li>Sales</li>
          <li>Inventory</li>
          <li><Link to="/ordersAdmin">Orders</Link></li>
          <li><Link to="/categoryAdmin">Categories</Link></li>
        </ul>
      </div>

      <div className="content">
        {/* Product List */}
        <div className="product-list">
          <h2>Product List</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Category</th>
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
                    <td>{product.category}</td>
                    <td>
                      <button className="edit" onClick={() => handleEditProduct(product)}>Edit</button>
                      <button className="delete" onClick={() => handleDeleteProduct(product.id, product.category)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No products available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Product Form */}
        <div className="add-product">
          <h2>{newProduct.id ? 'Edit Product' : 'Add Product'}</h2>
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
          <select value={newProduct.category} onChange={handleCategoryChange}>
            <option value="mobile">Mobile</option>
            <option value="laptops">Laptops</option>
          </select>
          <button onClick={handleAddProduct}>
            {newProduct.id ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
