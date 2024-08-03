import React, { useState, useEffect } from 'react';
import './NavBar.css';
import { useParams } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, query } from "firebase/firestore";

const Navbar = ({ setActiveCategory }) => {
  const { uid } = useParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!uid) {
      console.error('UID not provided');
      return;
    }

    const fetchCategories = async () => {
      try {
        const q = query(collection(db, 'restaurants', uid, 'categories'));
        const querySnapshot = await getDocs(q);
        const fetchedCategories = querySnapshot.docs.map(doc => ({
          _id: doc.id,
          ...doc.data()
        }));
        setCategories(fetchedCategories);
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
          <li key={category._id} className="category-item">
            <button
              className="category-button"
              onClick={() => setActiveCategory(category._id)}
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
