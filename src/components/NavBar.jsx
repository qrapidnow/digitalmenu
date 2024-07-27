import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NavBar.css';
import { useParams } from 'react-router-dom';

const Navbar = ({ setActiveCategory }) => {
  const { uid } = useParams(); // Get UID from URL parameters
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!uid) {
      console.error('UID not provided');
      return;
    }

    console.log("Fetching categories for UID:", uid);
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_BACKEND_API}/categories/${uid}`);
        console.log("Categories response:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [uid]);

  return (
    <nav className="navbar">
      <ul>
        {categories.map((category) => (
          <li key={category._id}>
            <button
              className="category-button"
              onClick={() => setActiveCategory(category._id)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
