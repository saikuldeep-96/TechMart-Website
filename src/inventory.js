import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, set, update, push, remove } from "firebase/database";
import "./inventory.css";

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: null,
    name: "",
    price: "",
    category: "mobile",
    stock: "",
  });
  const [search, setSearch] = useState("");

  // Fetch products from Firebase
  const fetchProducts = async () => {
    const db = getDatabase();
    const categories = ["mobile", "laptops"];
    let allProducts = [];
    try {
      for (const category of categories) {
        const productsRef = ref(db, `inventory/products/categories/${category}`);
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
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Add or Edit product
  const handleAddEditProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all fields.");
      return;
    }

    const db = getDatabase();
    const productRef = ref(db, `inventory/products/categories/${newProduct.category}`);
    try {
      if (newProduct.id) {
        // Edit product
        const productToUpdateRef = ref(db, `inventory/products/categories/${newProduct.category}/${newProduct.id}`);
        await update(productToUpdateRef, {
          name: newProduct.name,
          price: newProduct.price,
          stock: newProduct.stock,
        });
        console.log("Product updated successfully.");
      } else {
        // Add new product
        const newProductRef = push(productRef);
        await set(newProductRef, {
          name: newProduct.name,
          price: newProduct.price,
          stock: newProduct.stock,
        });
        console.log("New product added successfully.");
      }

      setNewProduct({
        id: null,
        name: "",
        price: "",
        category: "mobile",
        stock: "",
      });
      fetchProducts(); // Reload products after adding or updating
    } catch (error) {
      console.error("Error adding or updating product:", error);
      alert("Error: " + error.message);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId, category) => {
    try {
      const db = getDatabase();
      await remove(ref(db, `inventory/products/categories/${category}/${productId}`));
      console.log("Product deleted successfully.");
      fetchProducts(); // Reload products after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="inventory-page">
      <h2>Inventory Management</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products"
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Add/Edit Product Form */}
      <div className="product-form">
        <h3>{newProduct.id ? "Edit Product" : "Add Product"}</h3>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={handleChange}
        />
        <select
          name="category"
          value={newProduct.category}
          onChange={handleChange}
        >
          <option value="mobile">Mobile</option>
          <option value="laptops">Laptops</option>
        </select>
        <button onClick={handleAddEditProduct}>
          {newProduct.id ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* Product Table */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.stock}</td>
                <td>
                  <button onClick={() => setNewProduct(product)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id, product.category)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryPage;
