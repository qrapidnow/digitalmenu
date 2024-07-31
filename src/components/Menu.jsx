import React, { useEffect, useState, useRef } from 'react';
import './Menu.css';
import FoodItemCard from './FoodItemCard';
import { useParams } from 'react-router-dom';
import { db } from '../firebase-config';
import { collection, getDocs, query } from "firebase/firestore";

const Menu = ({ addItem, cart, updateItemCount, activeCategory, searchTerm }) => {
    const { uid } = useParams();  // Read UID from URL parameters
    const [sections, setSections] = useState([]);
    const sectionRefs = useRef({});

    useEffect(() => {
        if (!uid) {
            console.error('UID not provided');
            return;
        }

        const fetchCategoriesAndItems = async () => {
            try {
                const q = query(collection(db, 'restaurants', uid, 'categories'));
                const querySnapshot = await getDocs(q);
                const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const sectionsWithItems = await Promise.all(
                    categories.map(async (category) => {
                        const itemsQuery = query(collection(db, 'restaurants', uid, 'categories', category.id, 'items'));
                        const itemsSnapshot = await getDocs(itemsQuery);
                        const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        sectionRefs.current[category.id] = React.createRef();
                        return {
                            id: category.id,
                            title: category.name,
                            items
                        };
                    })
                );
                setSections(sectionsWithItems);
            } catch (error) {
                console.error('Error fetching categories or items:', error);
            }
        };

        fetchCategoriesAndItems();
    }, [uid]);

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
                                const cartItem = cart.find(cartItem => cartItem.id === item.id);
                                const quantity = cartItem ? cartItem.quantity : 0;
                                return (
                                    <FoodItemCard 
                                        key={item.id} 
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
