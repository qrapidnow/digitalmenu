import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NavBar.css';
import { useParams } from 'react-router-dom';

const Navbar = ({ setActiveCategory }) => {
  const { userId } = useParams(); // Get userId from URL parameters
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    console.log("Fetching categories for userId:", userId);
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        return;
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_BACKEND_API}/categories/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Categories response:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [userId]);

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
