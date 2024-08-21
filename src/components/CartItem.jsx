import React, { useState, useEffect } from 'react';
import './CartItem.css';
import { db } from '../firebase-config';
import { collection, doc, getDoc } from "firebase/firestore";
import PlaceOrderPage from './PlaceOrderPage';

const CartItem = ({ 
    cartItems, 
    setShowCartItem, 
    updateItemCount, 
    removeItem, 
    setShowCustomerForm, 
    showCustomerForm, 
    uid, // uid passed as a prop
}) => {
    const [restaurantName, setRestaurantName] = useState('');
    const [showPlaceOrderPage, setShowPlaceOrderPage] = useState(false);

    useEffect(() => {
        const fetchRestaurantName = async () => {
            if (uid) {
                try {
                    const docRef = doc(db, "restaurants", uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setRestaurantName(docSnap.data().name);
                    } else {
                        console.error("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching restaurant name: ", error);
                }
            }
        };

        fetchRestaurantName();
    }, [uid]);

    useEffect(() => {
        const storedCartData = JSON.parse(localStorage.getItem('cartData'));
        const currentTime = new Date().getTime();

        if (storedCartData) {
            if (currentTime - storedCartData.timestamp < 20 * 60 * 1000) {
                // Restore cart items from local storage
            } else {
                localStorage.removeItem('cartData');
            }
        }
    }, []);

    const saveCartData = () => {
        const cartData = {
            items: cartItems,
            timestamp: new Date().getTime(),
        };
        localStorage.setItem('cartData', JSON.stringify(cartData));
    };

    const handleBackToCart = () => {
        setShowCartItem(false); // Hide CartItem component, which should show the menu again
        setShowCustomerForm(false);
    };

    const handlePlaceOrderPage = () => {
        setShowPlaceOrderPage(true);
    };

    if (showPlaceOrderPage) {
        return (
            <div className="cart-item-container">
                <PlaceOrderPage
                    cartItems={cartItems}
                    setShowPlaceOrderPage={setShowPlaceOrderPage}
                />
            </div>
        );
    }

    const handleListButton = () => {
        setShowCartItem(false); // Hide CartItem component, which should show the menu again
    };

    return (
        <div className="cart-item-container">
            <div className="cart-item">
                <div className="cart-item-header">
                    <button className="back-button" onClick={handleBackToCart}>
                        ➜
                    </button>
                    <h2>{restaurantName || "CART"}</h2>
                </div>
                {cartItems.length === 0 ? (
                    <div className="empty-cart-message">
                        <p>No items added yet. Add items to your cart!</p>
                    </div>
                ) : (
                    <div className="cart-item-scrollable">
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item-row">
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    {item.variation ? (
                                        <p>{item.variation.name}: ₹{item.variation.price}/-</p>
                                    ) : (
                                        <p>₹{item.price}/-</p>
                                    )}
                                    <p>Quantity: {item.quantity}</p>
                                    <div className="quantity-controls">
                                        <button 
                                            onClick={() => updateItemCount(item.id, -1)} 
                                            disabled={item.quantity === 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateItemCount(item.id, 1)}>+</button>
                                    </div>
                                </div>
                                <button 
                                    className="delete-button" 
                                    onClick={() => removeItem(item)}
                                >
                                    🗑
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="cart-item-actions">
                    <button className="action-button" onClick={handleListButton}>
                        Add Items
                    </button>
                    {/* <button className="action-button" onClick={handleListButton}>
                        List
                    </button> */}
                    <button className="action-button" onClick={handlePlaceOrderPage}>
                        Place Order
                    </button>
                </div>
                <div className="thank-you-message">
                    <p>Thank you for using QRapid! Please call a waiter to share your list.</p>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
