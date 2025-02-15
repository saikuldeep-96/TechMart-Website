import React, { useState, useEffect } from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';  

function Home() {
  const [products, setProducts] = useState([]);  //updated with firebase database 
  const [loading, setLoading] = useState(true);   
  const [searchQuery, setSearchQuery] = useState(''); 

 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getDatabase();
        const categoriesRef = ref(db, 'products/categories'); 
        const snapshot = await get(categoriesRef);

        if (snapshot.exists()) {
          const categoriesData = snapshot.val();
          console.log("Fetched categories data:", categoriesData); 

          let allProducts = [];
         
          for (const category in categoriesData) {
            const categoryProducts = categoriesData[category];
            const categoryProductsList = Object.entries(categoryProducts).map(([id, product]) => ({
              id,
              name: product.name,
              price: product.price,
              image: product.image || "default-image-url", 
              category, 
            }));
            allProducts = [...allProducts, ...categoryProductsList];  
          }

          setProducts(allProducts);  
        } else {
          console.log("No categories found in Firebase.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchProducts();
  }, []); 

 
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

 
  const filteredProducts = products.filter((product) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>TechMart</h1>
          </div>
          <nav>
            <ul className="nav-links1">
              <li><Link to="/">Home</Link></li>
              <li><Link to="#">Products</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/blogs">Blogs</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>  
            </ul>
          </nav>
          <div className="auth-buttons">
            <Link to="/login-signup">
              <button className="login-btn">Login</button>  
            </Link>
          </div>
        </div>
      </header>

      <section className="search-bar">
        <div className="container">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button>Search</button>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="product-grid">
            {loading ? (
              <p>Loading products...</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>${product.price}</p>
                  <button>Add to Cart</button>
                </div>
              ))
            ) : (
              <p>No products found matching your search.</p>
            )}
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
}

export default Home;
