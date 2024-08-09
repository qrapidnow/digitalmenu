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
          ➜
        </button>
        <h2>Items List</h2>
      </div>
      <div className="list-content">
        {cartItems.map((item, index) => (
          <div key={index} className="list-item">
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{item.price}/-</p>
            </div>
          </div>
        ))}
      </div>
      <div className="thank-you-message">
        <p>Thanking you for using QRapid, waiter will come to your table soon.</p>
      </div>
    </div>
  );
};

export default List;
