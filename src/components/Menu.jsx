import React, { useEffect, useState, useRef } from 'react';
import './Menu.css';
import FoodItemCard from './FoodItemCard';
import { useParams } from 'react-router-dom';

const Menu = ({ addItem, cart, activeCategory, searchTerm }) => {
  const { uid } = useParams(); // Restaurant UID from the URL
  const [sections, setSections] = useState([]); // Stores categories and their items
  const sectionRefs = useRef({}); // References to each section for scrolling
  const apiBaseUrl = import.meta.env.VITE_APP_BASE_BACKEND_API; // Updated environment variable

  useEffect(() => {
    if (!uid) {
      console.error('Restaurant UID not provided');
      return;
    }

    const fetchCategoriesAndItems = async () => {
      try {
        console.log("Fetching categories for restaurant UID:", uid); // Debugging line

        // Fetch categories for the restaurant
        const categoryResponse = await fetch(`${apiBaseUrl}/categories/${uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure the token is correct
          }
        });

        if (!categoryResponse.ok) {
          const errorText = await categoryResponse.text();
          throw new Error(`Failed to fetch categories from the backend. Status: ${categoryResponse.status}, Error: ${errorText}`);
        }

        const categories = await categoryResponse.json();
        console.log("Fetched categories:", categories); // Debugging line

        // Fetch items for each category
        const sectionsWithItems = await Promise.all(
          categories.map(async (category) => {
            console.log(`Fetching items for category ID: ${category._id}`); // Debugging line

            const itemsResponse = await fetch(`${apiBaseUrl}/items/${category._id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure the token is correct
              }
            });

            if (!itemsResponse.ok) {
              const errorText = await itemsResponse.text();
              throw new Error(`Failed to fetch items for category ${category.name}. Status: ${itemsResponse.status}, Error: ${errorText}`);
            }

            const items = await itemsResponse.json();
            console.log(`Fetched items for category ${category.name}:`, items); // Debugging line

            sectionRefs.current[category._id] = React.createRef();

            return {
              id: category._id,
              title: category.name,
              items
            };
          })
        );

        setSections(sectionsWithItems);
        console.log("Final sections with items:", sectionsWithItems); // Debugging line

      } catch (error) {
        console.error('Error fetching categories or items:', error.message); // Debugging line
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
