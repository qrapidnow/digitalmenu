import React, { useState } from 'react';
import './CartItem.css';
import List from './List';  // Import the List component

const CartItem = ({ cartItems, setShowCartItem, updateItemCount, removeItem }) => {
  const [showListPage, setShowListPage] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const handleBackToCart = () => {
    setShowCartItem(false);
  };

  const handleListButton = () => {
    setShowListPage(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  };

  if (showListPage && isFormSubmitted) {
    return (
      <div className="cart-item-container">
        <List
          cartItems={cartItems}
          customerName={customerName}
          whatsappNumber={whatsappNumber}
          setShowListPage={setShowListPage}
        />
      </div>
    );
  }

  if (showListPage && !isFormSubmitted) {
    return (
      <div className="cart-item-container">
        <div className="cart-item">
          <div className="cart-item-header">
            <button className="back-button" onClick={handleBackToCart}>
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
                  <p>₹{item.price}/-</p>
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
          <button className="action-button" onClick={() => setShowCartItem(false)}>
            Add Items
          </button>
          <button className="action-button" onClick={handleListButton}>
            List
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
