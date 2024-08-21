import React, { useState, useEffect, createContext } from 'react';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Navbar from './components/NavBar';
import Menu from './components/Menu';
import CartItem from './components/CartItem';
import PlaceOrderPage from './components/PlaceOrderPage';
import BackToTopButton from './components/BackToTopButton';
import { useParams } from 'react-router-dom';

export const CartContext = createContext();

const App = () => {
    const { uid } = useParams();
    const [cart, setCart] = useState([]);
    const [showCartItem, setShowCartItem] = useState(false);
    const [showPlaceOrderPage, setShowPlaceOrderPage] = useState(false);
    const [showCustomerForm, setShowCustomerForm] = useState(false);
    const [restaurantName, setRestaurantName] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFixed, setIsFixed] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const apiBaseUrl = import.meta.env.VITE_APP_BASE_BACKEND_API;

    useEffect(() => {
        if (uid) {
            console.log(`UID provided: ${uid}`); // Debug log
            fetchRestaurantDetails(uid);
        } else {
            console.error("UID not provided"); // Debug log
        }
    }, [uid]);

    const fetchRestaurantDetails = async (uid) => {
        try {
            console.log(`Fetching restaurant details for UID: ${uid}`); // Debug log
            const response = await fetch(`${apiBaseUrl}/restaurant/${uid}`);

            console.log(`Received response with status: ${response.status}`); // Debug log
            
            if (response.ok) {
                const restaurantData = await response.json();
                console.log("Fetched restaurant data:", restaurantData);
                setRestaurantName(restaurantData.restaurantName); // Set the restaurant name
            } else {
                console.error('Failed to fetch restaurant data:', response.status, response.statusText);
                alert('Failed to load restaurant details. Please try again.');
            }
        } catch (error) {
            console.error('Error occurred while fetching restaurant details:', error);
            alert('Failed to load restaurant details. Please try again.');
        }
    };

    const addItem = (item) => {
        console.log('Adding new item:', item); // Debug log
        setCart((prevCart) => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

    const handleViewOrderClick = () => {
        setShowCustomerForm(true);
        setShowCartItem(false);
        setShowPlaceOrderPage(false);
    };

    const handleCartClick = () => {
        setShowCustomerForm(true);
        setShowCartItem(false);
        setShowPlaceOrderPage(false);
    };

    const removeItem = (itemToRemove) => {
        console.log('Removing item:', itemToRemove); // Debug log
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemToRemove.id));
    };

    const updateItemCount = (itemId, countChange) => {
        console.log(`Updating item count for item ID ${itemId} by ${countChange}`); // Debug log
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === itemId ? { ...item, quantity: item.quantity + countChange } : item
            ).filter(item => item.quantity > 0)
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 100) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
            if (offset > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        console.log('Cart updated:', cart); // Debug log
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            <div className="app">
                <div className="header-container">
                    <Header restaurantName={restaurantName} />
                </div>
                <div className={`search-cart-container ${isFixed ? 'fixed' : ''}`}>
                    <SearchBar setSearchTerm={setSearchTerm} />
                    <button className="cart-button" onClick={handleCartClick}>🛒</button>
                </div>
                <div className={`navbar ${isFixed ? 'fixed' : ''}`}>
                    <Navbar setActiveCategory={setActiveCategory} />
                </div>
                <div className={`content-container ${isFixed ? 'fixed-margin' : ''}`}>
                    <Menu 
                        addItem={addItem}
                        cart={cart}
                        updateItemCount={updateItemCount}
                        activeCategory={activeCategory}
                        searchTerm={searchTerm}
                    />
                </div>
                {!showCartItem && !showCustomerForm && getTotalItems() > 0 && (
                    <div className="view-order-bar" onClick={handleViewOrderClick}>
                        <span>View Order</span>
                        <span className="order-count">{getTotalItems()}</span>
                    </div>
                )}
                {showCustomerForm && (
                    <CartItem
                        cartItems={cart}
                        setShowCartItem={setShowCartItem}
                        setShowCustomerForm={setShowCustomerForm}
                        updateItemCount={updateItemCount}
                        removeItem={removeItem}
                        restaurantName={restaurantName}  // Ensure restaurantName is passed correctly
                    />
                )}
                {showPlaceOrderPage && (
                    <PlaceOrderPage cartItems={cart} setShowPlaceOrderPage={setShowPlaceOrderPage} />
                )}
                {!showCartItem && <BackToTopButton isVisible={showBackToTop} />}
            </div>
        </CartContext.Provider>
    );
};

export default App;
