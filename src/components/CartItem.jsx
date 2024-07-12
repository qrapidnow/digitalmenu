import React, { useState } from 'react';
import './CartItem.css';
import PlaceOrderPage from './PlaceOrderPage';
import AskForBillPage from './AskForBillPage';

const CartItem = ({ cartItems, orderedItems, setCart, removeItem, setShowCartItem, updateItemCount, setShowPlaceOrderPage }) => {
  const [showPlaceOrderPage, setShowPlaceOrderPageState] = useState(false);
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
    setShowPlaceOrderPageState(true);
    setShowPlaceOrderPage(true);
  };

  const handleAskForBill = () => {
    // Assuming nameEntered and whatsappEntered are passed to CartItem component
    if (nameEntered && whatsappEntered) {
      setShowAskForBillPage(true);
    } else {
      alert('Please enter your name and WhatsApp number before asking for the bill.');
    }
  };

  const handleQuantityChange = (item, countChange) => {
    const newQuantity = item.quantity + countChange;
    if (newQuantity > 0) {
      updateItemCount(item.id, countChange);
    } else {
      removeItem(item);
    }
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
        {totalItems === 0 && orderedItems.length === 0 ? (
          <div className="empty-cart-message">
            <p>No items added yet. Add items to your cart!</p>
          </div>
        ) : (
          <>
            {orderedItems.length > 0 && (
              <div className="ordered-items">
                <h3>Ordered Items:</h3>
                <div className="cart-item-scrollable">
                  {orderedItems.map((item, index) => (
                    <div key={index} className="cart-item-row">
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p>₹{item.price}/-</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {totalItems > 0 && (
              <div className="new-items-for-ordering">
                <h3>New Items for Ordering:</h3>
                <div className="cart-item-scrollable">
                  {cartItems.map((item, index) => (
                    <div key={index} className="cart-item-row">
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p>₹{item.price}/-</p>
                        <p>Quantity: {item.quantity}</p>
                        <div className="quantity-controls">
                          <button
                            className="quantity-button"
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button className="quantity-button" onClick={() => handleQuantityChange(item, 1)}>
                            +
                          </button>
                        </div>
                      </div>
                      <button className="delete-button" onClick={() => removeItem(item)}>
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div className="cart-item-actions">
          <button className="action-button" onClick={handleAddItems}>
            Add Items
          </button>
          {totalItems > 0 && (
            <button className="action-button" onClick={handlePlaceOrderPage}>
              Place Order
            </button>
          )}
          <button className="action-button ask-for-bill-button" onClick={handleAskForBill}>
            Ask For Bill
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
