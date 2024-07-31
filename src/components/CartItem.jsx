import React, { useState } from 'react';
import './CartItem.css';
import PlaceOrderPage from './PlaceOrderPage';
import AskForBillPage from './AskForBillPage';

const CartItem = ({ cartItems, setCart, removeItem, setShowCartItem, updateItemCount }) => {
  const [showPlaceOrderPage, setShowPlaceOrderPage] = useState(false);
  const [showAskForBillPage, setShowAskForBillPage] = useState(false);

  const handleBackToCart = () => {
    setShowPlaceOrderPage(false);
    setShowAskForBillPage(false);
    setShowCartItem(true); // Ensure the cart item view is re-enabled when navigating back
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  const handlePlaceOrderPage = () => {
    setShowPlaceOrderPage(true);
    setShowCartItem(false); // Disable the cart item view when navigating to place order page
  };

  const handleAskForBill = () => {
    // Assuming name and WhatsApp number verification is handled somewhere
    if (nameEntered && whatsappEntered) { // These should be managed via state or props
      setShowAskForBillPage(true);
      setShowCartItem(false); // Disable the cart item view when navigating to ask for bill page
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
          <button className="back-button" onClick={handleBackToCart}>➜</button>
          <h2>CART</h2>
        </div>
        {totalItems === 0 ? (
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
                    <button onClick={() => updateItemCount(item._id, -1)} disabled={item.quantity === 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateItemCount(item._id, 1)}>+</button>
                  </div>
                </div>
                <button className="delete-button" onClick={() => removeItem(item)}>🗑</button>
              </div>
            ))}
          </div>
        )}
        <div className="cart-item-actions">
          <button className="action-button" onClick={handlePlaceOrderPage}>Place Order</button>
          <button className="action-button" onClick={handleAskForBill}>Ask for Bill</button>
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
