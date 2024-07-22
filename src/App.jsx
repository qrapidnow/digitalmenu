import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Navbar from './components/NavBar';
import Menu from './components/Menu';
import CartItem from './components/CartItem';
import PlaceOrderPage from './components/PlaceOrderPage'; // Import PlaceOrderPage
import BackToTopButton from './components/BackToTopButton'; // Import the BackToTopButton component
import { useParams } from 'react-router-dom'; // Import useParams

const App = () => {
    const { userId } = useParams(); // Get userId from URL parameters
    const [cart, setCart] = useState([]);
    const [showCartItem, setShowCartItem] = useState(false);
    const [showPlaceOrderPage, setShowPlaceOrderPage] = useState(false);
    const [restaurantName, setRestaurantName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFixed, setIsFixed] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false); // State for Back to Top button visibility

    useEffect(() => {
        const backendApiUrl = import.meta.env.VITE_APP_BASE_BACKEND_API;

        const fetchUsersAndToken = async () => {
            try {
                const usersResponse = await axios.get(`${backendApiUrl}/users`);
                console.log('Users response:', usersResponse.data);
                const users = usersResponse.data;
                if (users && users.length > 0) {
                    const tokenResponse = await axios.get(`${backendApiUrl}/token/${userId}`);
                    console.log('Token response:', tokenResponse.data);
                    const token = tokenResponse.data.token;
                    if (token) {
                        localStorage.setItem('token', token);
                        const restaurantResponse = await fetchRestaurant(token);
                        console.log('Restaurant response:', restaurantResponse);
                        if (restaurantResponse && restaurantResponse._id) {
                            localStorage.setItem('restaurantId', restaurantResponse._id);
                            console.log('Set restaurantId in localStorage:', restaurantResponse._id);
                        }
                    }
                } else {
                    console.error('No users found');
                }
            } catch (error) {
                console.error('Error fetching users or token:', error);
            }
        };

        fetchUsersAndToken();
    }, [userId]);

    const fetchRestaurant = async (token) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BASE_BACKEND_API}/restaurant`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Fetched restaurant data:', response.data);
            setRestaurantName(response.data.name);
            setIsLoggedIn(true);
            return response.data;
        } catch (error) {
            console.error('Error fetching restaurant data:', error);
        }
    };

    const addItem = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(cartItem => cartItem._id === item._id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem._id === item._id
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
        setShowCartItem(true);
        setShowPlaceOrderPage(false);
    };

    const handleCartClick = () => {
        setShowCartItem(true);
        setShowPlaceOrderPage(false);
    };

    const removeItem = (itemToRemove) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== itemToRemove._id));
    };

    const updateItemCount = (itemId, countChange) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item._id === itemId ? { ...item, quantity: item.quantity + countChange } : item
            ).filter(item => item.quantity > 0)
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 100) { // Adjust this value as needed
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
            if (offset > 300) { // Show Back to Top button after scrolling down 300px
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

    if (!isLoggedIn) {
        return <div>Loading...</div>;
    }

    return (
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
            {!showCartItem && getTotalItems() > 0 && (
                <div className="view-order-bar" onClick={handleViewOrderClick}>
                    <span>View Order</span>
                    <span className="order-count">{getTotalItems()}</span>
                </div>
            )}
            {showCartItem && (
                <CartItem
                    cartItems={cart}
                    setCart={setCart}
                    removeItem={removeItem}
                    setShowCartItem={setShowCartItem}
                    updateItemCount={updateItemCount}
                />
            )}
            {showPlaceOrderPage && (
                <PlaceOrderPage cartItems={cart} setShowPlaceOrderPage={setShowPlaceOrderPage} />
            )}
            {!showCartItem && <BackToTopButton isVisible={showBackToTop} />}
        </div>
    );
};

export default App;
