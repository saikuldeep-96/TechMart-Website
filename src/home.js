import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";

function Home() {
    const [products, setProducts] = useState([]);
  
    useEffect(() => {
      const productsRef = ref(db, 'products/');
      onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        const productList = Object.keys(data || {}).map(key => ({ id: key, ...data[key] }));
        setProducts(productList);
      });
    }, []);
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Featured Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-700">${product.price}</p>
              <Link to={`/product/${product.id}`} className="text-blue-500">View Details</Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

export default Home;