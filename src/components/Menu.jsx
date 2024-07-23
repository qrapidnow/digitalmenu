import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Menu.css';
import FoodItemCard from './FoodItemCard';
import { useParams } from 'react-router-dom';

const Menu = ({ addItem, cart, updateItemCount, activeCategory, searchTerm }) => {
  const { userId } = useParams(); // Get userId from URL parameters
  const [sections, setSections] = useState([]);
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchCategoriesAndItems = async () => {
      const token = localStorage.getItem('token');
      const restaurantId = localStorage.getItem('restaurantId');
      if (!token || !restaurantId) {
        console.error('Token or restaurant ID not found in localStorage');
        return;
      }
      try {
        const categoriesResponse = await axios.get(`${import.meta.env.VITE_APP_BASE_BACKEND_API}/categories/${restaurantId}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const categories = categoriesResponse.data;
        const sectionsWithItems = await Promise.all(
          categories.map(async (category) => {
            const itemsResponse = await axios.get(`${import.meta.env.VITE_APP_BASE_BACKEND_API}/items/${category._id}/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            sectionRefs.current[category._id] = React.createRef();
            return {
              id: category._id,
              title: category.name,
              items: itemsResponse.data
            };
          })
        );
        setSections(sectionsWithItems);
      } catch (error) {
        console.error('Error fetching categories or items:', error);
      }
    };

    fetchCategoriesAndItems();
  }, [userId]);

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
          <div className="menu-items-container">
            <div className="menu-items">
              {section.items.map((item) => {
                const cartItem = cart.find(cartItem => cartItem._id === item._id);
                const quantity = cartItem ? cartItem.quantity : 0;
                return (
                  <FoodItemCard 
                    key={item._id} 
                    item={item} 
                    addItem={addItem} 
                    quantity={quantity}
                    updateItemCount={updateItemCount} 
                  />
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;
