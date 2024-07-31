import React, { useState } from 'react';
import './CartItem.css';
import PlaceOrderPage from './PlaceOrderPage';
import AskForBillPage from './AskForBillPage';
import FoodItemCard from './FoodItemCard'; // Ensure you import this component

const CartItem = ({ cartItems, setCart, removeItem, setShowCartItem, updateItemCount, addItem }) => {
    const [showPlaceOrderPage, setShowPlaceOrderPage] = useState(false);
    const [showAskForBillPage, setShowAskForBillPage] = useState(false);

    const handleBackToCart = () => {
        setShowCartItem(false);
    };

    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalAmount = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

    const handleAddItems = () => {
        setShowCartItem(false);
    };

    const handlePlaceOrderPage = () => {
        setShowPlaceOrderPage(true);
    };

    const handleAskForBill = () => {
        // Placeholder for actual validation logic
        const nameEntered = true;  // Assume this variable is correctly managed elsewhere
        const whatsappEntered = true;  // Assume this variable is correctly managed elsewhere
        if (nameEntered && whatsappEntered) {
            setShowAskForBillPage(true);
        } else {
            alert('Please enter your name and WhatsApp number before asking for the bill.');
        }
    };

    if (showPlaceOrderPage) {
        return (
            <PlaceOrderPage
                cartItems={cartItems}
                setShowPlaceOrderPage={setShowPlaceOrderPage}
            />
        );
    }

    if (showAskForBillPage) {
        return (
            <AskForBillPage
                cartItems={cartItems}
                setShowAskForBillPage={setShowAskForBillPage}
            />
        );
    }

    return (
        <div className="cart-item-container">
            <div className="cart-item">
                <div className="cart-item-header">
                    <button className="back-button" onClick={handleBackToCart}>
                        ➜
                    </button>
                    <h2>CART</h2>
                </div>
                {totalItems === 0 ? (
                    <div className="empty-cart-message">
                        <p>No items added yet. Add items to your cart!</p>
                    </div>
                ) : (
                    <div className="cart-item-scrollable">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item-row">
                                <FoodItemCard 
                                    item={item}
                                    addItem={addItem}
                                    quantity={item.quantity}
                                    updateItemCount={(id, change) => updateItemCount(id, change)}
                                />
                                <button className="delete-button" onClick={() => removeItem(item)}>
                                    🗑
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="cart-item-actions">
                    <button className="action-button" onClick={handleAddItems}>
                        Add Items
                    </button>
                    <button className="action-button" onClick={handlePlaceOrderPage}>
                        Place Order
                    </button>
                </div>
                {totalItems > 0 && (
                    <div className="totals-container">
                        <div className="totals-column">
                            <h3>Total Quantity:</h3>
                            <p>{totalItems}</p>
                        </div>
                        <div className="totals-column">
                            <h3>Total Amount:</h3>
                            <p>₹{totalAmount}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartItem;
