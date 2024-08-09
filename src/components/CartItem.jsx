import React, { useState, useEffect } from 'react';
import './CartItem.css';
import List from './List';  // Import the List component

const CartItem = ({ cartItems, setShowCartItem, updateItemCount, removeItem }) => {
  const [showListPage, setShowListPage] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [restaurantName, setRestaurantName] = useState('');  // Add state for restaurant name

  useEffect(() => {
    const storedCustomerData = JSON.parse(localStorage.getItem('customerData'));
    const currentTime = new Date().getTime();

    if (storedCustomerData && currentTime - storedCustomerData.timestamp < 20 * 60 * 1000) {
      setCustomerName(storedCustomerData.name);
      setWhatsappNumber(storedCustomerData.whatsapp_number);
      setRestaurantName(storedCustomerData.restaurant_name);
      setIsFormSubmitted(true);
      setShowListPage(true);
    }
  }, []);

  const handleBackToCart = () => {
    setShowCartItem(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Save customer details in localStorage with timestamp
    const customerData = {
      name: customerName,
      whatsapp_number: whatsappNumber,
      restaurant_name: restaurantName,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem('customerData', JSON.stringify(customerData));

    setIsFormSubmitted(true);
    setShowListPage(true);  // Automatically show the List component after form submission
  };

  if (showListPage) {
    return (
      <div className="cart-item-container">
        <List
          cartItems={cartItems}
          customerName={customerName}
          whatsappNumber={whatsappNumber}
          restaurantName={restaurantName}  // Pass restaurant name to List component
          setShowListPage={setShowListPage}
        />
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
          <button className="action-button" onClick={handleFormSubmit}>
            Submit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
