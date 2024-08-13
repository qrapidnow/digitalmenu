import React from 'react';
import './CartItem.css';

const CartItem = ({ cartItems, setShowCartItem, updateItemCount, removeItem, restaurantName }) => {

    const handleBackToCart = () => {
        setShowCartItem(false);
    };

    return (
        <div className="cart-item-container">
            <div className="cart-item">
                <div className="cart-item-header">
                    <button className="back-button" onClick={handleBackToCart}>
                        ➜
                    </button>
                    <h2>CART</h2>
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
                                        <button onClick={() => updateItemCount(item.id, -1)} disabled={item.quantity === 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateItemCount(item.id, 1)}>+</button>
                                    </div>
                                </div>
                                <button className="delete-button" onClick={() => removeItem(item)}>
                                    🗑
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="cart-item-actions">
                    <button className="action-button" onClick={handleBackToCart}>
                        Add Items
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
