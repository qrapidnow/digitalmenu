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
import { collection, getDocs, query, where, doc, getDoc, addDoc } from "firebase/firestore";

// Creating a context for cart management
export const CartContext = createContext();

const App = () => {
    const { uid } = useParams();  // Read UID from URL parameters
    const [cart, setCart] = useState([]);
    const [showCartItem, setShowCartItem] = useState(false);
    const [showPlaceOrderPage, setShowPlaceOrderPage] = useState(false);
    const [restaurantName, setRestaurantName] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFixed, setIsFixed] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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
        setShowCartItem(true);
        setShowPlaceOrderPage(false);
    };

    const handleCartClick = () => {
        setShowCartItem(true);
        setShowPlaceOrderPage(false);
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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Save customer details along with the digital menu (restaurantName) to Firestore
            await addDoc(collection(db, "customer-details"), {
                name: customerName,
                whatsapp_number: whatsappNumber,
                timestamp: new Date(),
                digital_menu: restaurantName,  // Including the digital menu or restaurant name
            });
            setIsFormSubmitted(true);
            saveCartData();
        } catch (error) {
            console.error("Error adding document:", error.message, error.code, error.stack);
            alert("There was an error saving your information. Please try again.");
        }
    };

    const saveCartData = () => {
        const cartData = {
            items: cart,
            timestamp: new Date().getTime(),
        };
        const customerData = {
            name: customerName,
            whatsapp_number: whatsappNumber,
        };
        localStorage.setItem('cartData', JSON.stringify(cartData));
        localStorage.setItem('customerData', JSON.stringify(customerData));
    };

    useEffect(() => {
        // Load cart data from local storage
        const storedCartData = JSON.parse(localStorage.getItem('cartData'));
        const storedCustomerData = JSON.parse(localStorage.getItem('customerData'));
        const currentTime = new Date().getTime();
        
        if (storedCartData && storedCustomerData) {
            // Check if the stored data is within the 20-minute limit
            if (currentTime - storedCartData.timestamp < 20 * 60 * 1000) {
                setShowCartItem(true);
                setCustomerName(storedCustomerData.name);
                setWhatsappNumber(storedCustomerData.whatsapp_number);
                setIsFormSubmitted(true);
            } else {
                // Clear expired data
                localStorage.removeItem('cartData');
                localStorage.removeItem('customerData');
            }
        }
    }, []);

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
                {showCartItem && !isFormSubmitted && (
                    <div className="cart-item-container">
                        <div className="cart-item">
                            <div className="cart-item-header">
                                <button className="back-button" onClick={() => setShowCartItem(false)}>
                                    ➜
                                </button>
                                <h2>Customer Details</h2>
                            </div>
                            <form onSubmit={handleFormSubmit} className="customer-form">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    required
                                />
                                <label htmlFor="whatsapp">WhatsApp Number:</label>
                                <input
                                    type="text"
                                    id="whatsapp"
                                    value={whatsappNumber}
                                    onChange={(e) => setWhatsappNumber(e.target.value)}
                                    required
                                />
                                <button type="submit" className="action-button">
                                    Submit
                                </button>
                                <p className="reward-message">
                                    Providing your name and WhatsApp number is required for a chance to receive a 50% reward if you win.
                                </p>
                            </form>
                        </div>
                    </div>
                )}
                {showCartItem && isFormSubmitted && (
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
        </CartContext.Provider>
    );
};

export default App;
