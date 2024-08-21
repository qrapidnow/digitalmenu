import React, { useState, useEffect } from 'react';
import './NavBar.css';
import { useParams } from 'react-router-dom';

const Navbar = ({ setActiveCategory }) => {
  const { uid } = useParams();
  const [categories, setCategories] = useState([]);
  const [activeButton, setActiveButton] = useState(null); // State to track active button
  const apiBaseUrl = import.meta.env.VITE_APP_BASE_BACKEND_API;

  useEffect(() => {
    if (!uid) {
      console.error('UID not provided');
      return;
    }

    const fetchCategories = async () => {
      try {
        console.log("Fetching categories for restaurant UID:", uid); // Debugging line

        const categoryResponse = await fetch(`${apiBaseUrl}/categories/${uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('bestTimeToken')}` // Use bestTimeToken from local storage
          }
        });

        if (!categoryResponse.ok) {
          const errorText = await categoryResponse.text();
          throw new Error(`Failed to fetch categories from the backend. Status: ${categoryResponse.status}, Error: ${errorText}`);
        }

        const fetchedCategories = await categoryResponse.json();
        console.log("Fetched categories:", fetchedCategories); // Debugging line

        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };

    fetchCategories();
  }, [uid, apiBaseUrl]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setActiveButton(categoryId); // Set the active button
  };

  return (
    <nav className="navbar">
      <ul>
        {categories.map((category) => (
          <li key={category._id} className="category-item">
            <button
              className={`category-button ${activeButton === category._id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category._id)}
            >
              <div className="category-content">
                <img src={category.image} alt={category.name} className="category-image" />
                <span>{category.name}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
