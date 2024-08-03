import React, { useState } from 'react';
import './FoodItemCard.css';

const FoodItemCard = ({ item, addItem, quantity, updateItemCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    console.log('Adding item:', item);
    addItem(item);
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
            <button onClick={(e) => { e.stopPropagation(); updateItemCount(item._id, -1); }} disabled={quantity === 0}>-</button>
            <span>{quantity}</span>
            <button onClick={(e) => { e.stopPropagation(); updateItemCount(item._id, 1); }}>+</button>
            <button onClick={handleAdd} className="add-button">Add</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodItemCard;
