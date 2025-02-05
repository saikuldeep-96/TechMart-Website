import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, set, remove, update } from 'firebase/database';
import './categoryAdmin.css';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const db = getDatabase();  // Initialize Firebase Realtime Database instance

  // Fetch categories from Firebase
  const fetchCategories = async () => {
    try {
      const categoriesRef = ref(db, 'categories');
      const snapshot = await get(categoriesRef);
      if (snapshot.exists()) {
        const fetchedCategories = Object.entries(snapshot.val()).map(([categoryId, category]) => ({
          categoryId,
          ...category,
        }));
        setCategories(fetchedCategories);  // Set categories in state
      } else {
        setCategories([]);  // If no categories exist, set empty array
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add a new category
  const addCategory = async () => {
    if (!categoryName) return;  // Ensure category name is provided

    try {
      const newCategoryRef = ref(db, 'categories/' + Date.now());  // Use current timestamp as unique ID
      await set(newCategoryRef, {
        name: categoryName,
      });
      setCategoryName('');  // Clear the input field after adding
      fetchCategories();  // Refresh the category list
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Edit an existing category
  const editCategory = async () => {
    if (!categoryName || !editCategoryId) return;

    try {
      const categoryRef = ref(db, `categories/${editCategoryId}`);
      await update(categoryRef, { name: categoryName });
      setCategoryName('');  // Clear the input field
      setEditCategoryId(null);  // Clear the editing mode
      fetchCategories();  // Refresh the category list
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Delete a category
  const deleteCategory = async (categoryId) => {
    try {
      const categoryRef = ref(db, `categories/${categoryId}`);
      await remove(categoryRef);  // Remove the category from Firebase
      fetchCategories();  // Refresh the category list
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Set up the category page and fetch categories when the component is mounted
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="category-page">
      <h2>Category Management</h2>

      {/* Add/Edit Category */}
      <div className="category-form">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
        />
        <button onClick={editCategoryId ? editCategory : addCategory}>
          {editCategoryId ? 'Update Category' : 'Add Category'}
        </button>
      </div>

      {/* Categories List */}
      <div className="category-list">
        {categories.length > 0 ? (
          <ul>
            {categories.map((category) => (
              <li key={category.categoryId}>
                {category.name}
                <button onClick={() => {
                  setCategoryName(category.name);  // Set name for editing
                  setEditCategoryId(category.categoryId);  // Set editing mode
                }}>
                  Edit
                </button>
                <button onClick={() => deleteCategory(category.categoryId)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories available.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
