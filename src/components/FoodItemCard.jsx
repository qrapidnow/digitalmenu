import React from 'react';
import './FoodItemCard.css';

const FoodItemCard = ({ item, addItem }) => {
  const handleAdd = (e) => {
    e.stopPropagation();
    console.log('Adding item:', item);
    addItem(item);
  };

  return (
    <div className="food-item-card">
      <div className="food-item-content">
        <img src={item.image} alt={item.name} className="food-item-image" />
        <div className="food-item-details">
          <h3 className="food-item-title">{item.name}</h3>
          <p className="food-item-price">₹{item.price}</p>
          <p className="food-item-description">{item.description}</p>
          <button onClick={handleAdd} className="add-button">Add</button>
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;
