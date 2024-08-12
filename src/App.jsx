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
import { db } from './firebase-config';
import { doc, getDoc } from "firebase/firestore";

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
    const [showMenu, setShowMenu] = useState(true);

    useEffect(() => {
        if (uid) {
            fetchRestaurantDetails(uid);
        } else {
            console.error("UID not provided");
        }
    }, [uid]);

    const fetchRestaurantDetails = async (uid) => {
        try {
            const docRef = doc(db, 'restaurants', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const restaurantData = docSnap.data();
                console.log("Fetched restaurant data:", restaurantData);
                setRestaurantName(restaurantData.restaurantName);
            } else {
                console.error('No restaurant found');
            }
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
            alert('Failed to load restaurant details. Please try again.');
        }
    };

    const addItem = (item) => {
        console.log('Adding new item:', item);
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
        setShowMenu(false);
    };

    const handleCartClick = () => {
        setShowCustomerForm(true);
        setShowCartItem(false);
        setShowPlaceOrderPage(false);
        setShowMenu(false);
    };

    const removeItem = (itemToRemove) => {
        console.log('Removing item:', itemToRemove);
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemToRemove.id));
    };

    const updateItemCount = (itemId, countChange) => {
        console.log(`Updating item count for item ID ${itemId} by ${countChange}`);
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === itemId ? { ...item, quantity: item.quantity + countChange } : item
            ).filter(item => item.quantity > 0)
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setIsFixed(offset > 100);
            setShowBackToTop(offset > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        console.log('Cart updated:', cart);
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
                    {showMenu && (
                        <Menu
                            addItem={addItem}
                            cart={cart}
                            updateItemCount={updateItemCount}
                            activeCategory={activeCategory}
                            searchTerm={searchTerm}
                        />
                    )}
                </div>
                {!showCartItem && !showCustomerForm && getTotalItems() > 0 && (
                    <div className="view-order-bar" onClick={handleViewOrderClick}>
                        <span>View Order</span>
                        <span className="order-count">{getTotalItems()}</span>
                    </div>
                )}
                {showCustomerForm && !showCartItem && (
                    <CartItem
                        cartItems={cart}
                        setShowCartItem={setShowCartItem}
                        setShowCustomerForm={setShowCustomerForm}
                        updateItemCount={updateItemCount}
                        removeItem={removeItem}
                        restaurantName={restaurantName}
                        setShowMenu={setShowMenu}
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
