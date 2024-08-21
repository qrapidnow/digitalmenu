import React, { useEffect, useState, useRef } from 'react';
import './Menu.css';
import FoodItemCard from './FoodItemCard';
import { useParams } from 'react-router-dom';

const Menu = ({ addItem, cart, activeCategory, searchTerm }) => {
  const { uid } = useParams(); // Restaurant UID from the URL
  const [sections, setSections] = useState([]); // Stores categories and their items
  const sectionRefs = useRef({}); // References to each section for scrolling
  const apiBaseUrl = import.meta.env.VITE_APP_BASE_BACKEND_API; // Updated environment variable

  const fetchBestTimeToken = async () => {
    try {
      console.log(`Fetching bestTimeToken for restaurant UID: ${uid}`); // Debug log

      const tokenResponse = await fetch(`${apiBaseUrl}/restaurant/${uid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Using the stored token
        }
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Failed to fetch bestTimeToken from the backend. Status: ${tokenResponse.status}, Error: ${errorText}`);
      }

      const { bestTimeToken } = await tokenResponse.json();
      console.log(`Fetched bestTimeToken: ${bestTimeToken}`); // Debug log

      // Store bestTimeToken in localStorage or state
      localStorage.setItem('bestTimeToken', bestTimeToken);
      return bestTimeToken;
    } catch (error) {
      console.error('Error fetching bestTimeToken:', error.message);
      return null;
    }
  };

  useEffect(() => {
    if (!uid) {
      console.error('Restaurant UID not provided');
      return;
    }

    const fetchCategoriesAndItems = async () => {
      const bestTimeToken = await fetchBestTimeToken();
      if (!bestTimeToken) return;

      try {
        console.log("Fetching categories for restaurant UID:", uid); // Debug log

        // Fetch categories for the restaurant
        const categoryResponse = await fetch(`${apiBaseUrl}/categories/${uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bestTimeToken}` // Use bestTimeToken
          }
        });

        if (!categoryResponse.ok) {
          const errorText = await categoryResponse.text();
          throw new Error(`Failed to fetch categories from the backend. Status: ${categoryResponse.status}, Error: ${errorText}`);
        }

        const categories = await categoryResponse.json();
        console.log("Fetched categories:", categories); // Debug log

        // Check if categories are empty
        if (categories.length === 0) {
          console.log("No categories found.");
          return;
        }

        // Fetch items for each category
        const sectionsWithItems = await Promise.all(
          categories.map(async (category) => {
            console.log(`Fetching items for category ID: ${category._id}`); // Debug log

            const itemsResponse = await fetch(`${apiBaseUrl}/items/${category._id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bestTimeToken}` // Use bestTimeToken
              }
            });

            if (!itemsResponse.ok) {
              const errorText = await itemsResponse.text();
              throw new Error(`Failed to fetch items for category ${category.name}. Status: ${itemsResponse.status}, Error: ${errorText}`);
            }

            const items = await itemsResponse.json();
            console.log(`Fetched items for category ${category.name}:`, items); // Debug log

            sectionRefs.current[category._id] = React.createRef();

            return {
              id: category._id,
              title: category.name,
              items
            };
          })
        );

        console.log("Setting sections with items:", sectionsWithItems); // Debug log
        setSections(sectionsWithItems);
        console.log("Final sections with items:", sectionsWithItems); // Debug log

      } catch (error) {
        console.error('Error fetching categories or items:', error.message);
      }
    };

    fetchCategoriesAndItems();
  }, [uid, apiBaseUrl]);

  useEffect(() => {
    if (activeCategory && sectionRefs.current[activeCategory]) {
      sectionRefs.current[activeCategory].current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeCategory]);

  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }))
    .filter((section) => section.items.length > 0);

  if (filteredSections.length === 0) {
    console.log("No filtered sections to display.");
  }

  return (
    <div className="menu">
      {filteredSections.map((section) => (
        <div key={section.id} ref={sectionRefs.current[section.id]} className="menu-section">
          <h2>{section.title}</h2>
          <div className="menu-items">
            {section.items.map((item) => (
              <FoodItemCard 
                key={item._id} 
                item={item} 
                addItem={addItem} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
