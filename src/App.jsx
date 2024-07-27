import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Navbar from './components/NavBar';
import Menu from './components/Menu';
import CartItem from './components/CartItem';
import PlaceOrderPage from './components/PlaceOrderPage';
import BackToTopButton from './components/BackToTopButton';
import { useParams } from 'react-router-dom';
import { db, auth } from './firebase-config';  // Import the Firebase configuration
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
    const { uid } = useParams();  // Read UID from URL parameters
    const [cart, setCart] = useState([]);
    const [showCartItem, setShowCartItem] = useState(false);
    const [showPlaceOrderPage, setShowPlaceOrderPage] = useState(false);
    const [restaurantName, setRestaurantName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFixed, setIsFixed] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        fetchRestaurantDetails(uid);
    }, [uid]);

    const fetchRestaurantDetails = async (uid) => {
        try {
            const q = query(collection(db, 'restaurants'), where('uid', '==', uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const restaurantData = querySnapshot.docs[0].data();
                console.log("Fetched restaurant data:", restaurantData);
                setRestaurantName(restaurantData.restaurantName);
                setIsLoggedIn(true);
            } else {
                console.error('No restaurant found');
            }
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
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
