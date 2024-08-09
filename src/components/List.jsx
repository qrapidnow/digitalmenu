import React from 'react';
import './List.css';

const List = ({ cartItems, setShowListPage }) => {
  const handleBackToCart = () => {
    setShowListPage(false);
  };

  return (
    <div className="list-container">
      <div className="list-header">  
        <button className="back-button" onClick={handleBackToCart}>  
        ←  
        </button>  
        <h2 style={{ flexGrow: 1, textAlign: 'center' }}>Items List</h2>  
        </div>

      <div className="list-content">
        {cartItems.map((item, index) => (
          <div key={index} className="list-item">
            <div className="item-details">
              <h3>{item.name}</h3>
              {item.variation ? (
                <p>
                  {item.variation.name}: ₹{item.variation.price}/-
                </p>
              ) : (
                <p>Price: ₹{item.price}/-</p>
              )}
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="thank-you-message">
        <p>Thank you for using QRapid! Please call a waiter to share your list.</p>
      </div>
    </div>
  );
};

export default List;
