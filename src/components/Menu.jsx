import React, { useEffect, useState, useRef } from 'react';
import './Menu.css';
import FoodItemCard from './FoodItemCard';
import { useParams } from 'react-router-dom';

const Menu = ({ addItem, cart, activeCategory, searchTerm }) => {
  const { uid } = useParams(); // UID of the restaurant
  const [sections, setSections] = useState([]); // Stores categories and their items
  const sectionRefs = useRef({}); // References to each section for scrolling
  const apiBaseUrl = import.meta.env.VITE_APP_BASE_BACKEND_API; // Base URL of your backend API

  useEffect(() => {
    if (!uid) {
      console.error('Restaurant UID not provided');
      return;
    }

    const fetchCategoriesAndItems = async () => {
      try {
        // Fetch categories for the restaurant
        const categoryResponse = await fetch(`${apiBaseUrl}/categories/${uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch categories from the backend');
        }

        const categories = await categoryResponse.json();

        // Fetch items for each category
        const sectionsWithItems = await Promise.all(
          categories.map(async (category) => {
            const itemsResponse = await fetch(`${apiBaseUrl}/items/${category._id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            if (!itemsResponse.ok) {
              throw new Error(`Failed to fetch items for category ${category.name}`);
            }

            const items = await itemsResponse.json();
            sectionRefs.current[category._id] = React.createRef();

            return {
              id: category._id,
              title: category.name,
              items
            };
          })
        );

        setSections(sectionsWithItems);
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

  return (
    <div className="menu">
      {filteredSections.map((section) => (
        <div key={section.id} ref={sectionRefs.current[section.id]} className="menu-section">
          <h2>{section.title}</h2>
          <div className="menu-items">
            {section.items.map((item) => {
              return (
                <FoodItemCard 
                  key={item._id} 
                  item={item} 
                  addItem={addItem} 
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
