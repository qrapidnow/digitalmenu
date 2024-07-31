import React, { useState } from 'react';
import './FoodItemCard.css';

const FoodItemCard = ({ item, addItem, quantity, updateItemCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    console.log('Adding item:', item);
    addItem(item); // Add the item with initial quantity management
  };

  const handleIncrement = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    console.log('Incrementing item:', item);
    updateItemCount(item._id, 1); // Increment the item quantity
  };

  const handleDecrement = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    console.log('Decrementing item:', item);
    if (quantity > 0) {
      updateItemCount(item._id, -1); // Decrement the item quantity
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`food-item-card ${isExpanded ? 'expanded' : ''}`} onClick={toggleExpand}>
      <div className="food-item-summary">
        <h3 className="food-item-title">{item.name}</h3>
        <p className="food-item-price">₹{item.price}</p>
      </div>
      {isExpanded && (
        <div className="food-item-expanded-content">
          <p className="food-item-description">{item.description}</p>
          <span className="food-item-weight">{item.weight} g</span>
          <div className="food-item-controls">
            <button onClick={handleDecrement} disabled={quantity === 0}>-</button>
            <span>{quantity}</span>
            <button onClick={handleIncrement}>+</button>
            <button onClick={handleAdd} className="add-button">Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItemCard;
