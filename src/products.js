import React, { useState, useEffect } from 'react';
import './products.css';
import { FaShoppingCart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, set, update } from 'firebase/database';                               // updated with database, fetch, other functionalities

const Products = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);  // State to store fetched products
  const [filteredProducts, setFilteredProducts] = useState([]);  
  const [searchTerm, setSearchTerm] = useState('');  // State to track the search input
  const [cart, setCart] = useState([]); // State to store cart items

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle category selection from the dropdown
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);  // Update selected category
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getDatabase();
        const categories = ["mobile", "laptops"];
        let allProducts = [];

        for (const category of categories) {
          const productsRef = ref(db, `products/categories/${category}`);
          const snapshot = await get(productsRef);

          if (snapshot.exists()) {
            const productsData = snapshot.val();
            const productList = Object.entries(productsData).map(([id, product]) => ({
              id,
              name: product.name,
              price: product.price,
              description: product.description,
              image: product.image || "default-image-url",
              category,
            }));

            console.log(`Fetched ${category}:`, productList); // Log the products of the current category
            allProducts = [...allProducts, ...productList]; // Merge all products
          } else {
            console.log(`No products found for category: ${category}`);
          }
        }

        console.log("Fetched all products:", allProducts);
        setProducts(allProducts); // Set all products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); // This runs only once when the component mounts

  // Filter products based on selected category and search term
  useEffect(() => {
    const filteredProducts = products
      .filter(product => 
        (selectedCategory === "all" || product.category === selectedCategory) &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    setFilteredProducts(filteredProducts); // Update the filtered products state
  }, [selectedCategory, searchTerm, products]); // Runs whenever selectedCategory, searchTerm, or products change

  // Add product to cart
  const handleAddToCart = async (product) => {
    const user = getAuth().currentUser;  // Get the current logged-in user
    if (user) {
      const userId = user.uid;  // Get the user ID
      const db = getDatabase();

      // Fetch current cart data from Firebase
      const cartRef = ref(db, `carts/${userId}`);
      const snapshot = await get(cartRef);

      let updatedCart = [];
      if (snapshot.exists()) {
        updatedCart = Object.values(snapshot.val());  // Convert object to array
      }

      // Check if the product is already in the cart
      const existingProduct = updatedCart.find((item) => item.id === product.id);

      if (existingProduct) {
        // If the product is already in the cart, update the quantity
        updatedCart = updatedCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If the product is not in the cart, add it
        updatedCart.push({ ...product, quantity: 1 });
      }

      // Update cart in Firebase
      await set(cartRef, updatedCart);  // Save the updated cart in Firebase
      setCart(updatedCart);  // Update the local cart state
    } else {
      console.log("No user is logged in.");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);  // Update search term as user types
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>TechMart</h1>
          </div>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </nav>
          <div className="auth-buttons">
            <Link to="/">
              <button className="login-btn">Logout</button>
            </Link>

            <Link to="/profile">
              <button className="login-btn">Profile</button>  
            </Link>

            <Link to="/order-history">
              <button className="login-btn">Orders</button>  
            </Link>
            <div className="cart-icon">
              <Link to="/cart">
                <FaShoppingCart size={40} />
                <span>{cart.length}</span> {/* Display number of items in the cart */}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Category Dropdown */}
      <section className="category-dropdown">
        <div className={`category-dropdown ${isDropdownOpen ? 'open' : ''}`}>
          <button className="category-btn" onClick={toggleDropdown}>
            <FaBars /> Categories
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => handleCategorySelect("mobile")}>Mobiles</button>
              <button onClick={() => handleCategorySelect("laptops")}>Laptops</button>
              <button onClick={() => handleCategorySelect("all")}>All</button>
            </div>
          )}
        </div>
      </section>

      {/* Search Bar */}
      <section className="search-bar">
        <div className="container">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <button>Search</button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2>{selectedCategory === "all" ? "All Products" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`}</h2>
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div>No image available</div>
                  )}
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>${product.price}</p>
                  <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                </div>
              ))
            ) : (
              <p>No products found in this category.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>About Us | Terms and Conditions | Privacy Policy | Services @ TechMart Canada, Suite 104, Ontario</p>
        </div>
      </footer>
    </div>
  );
}

export default Products;
