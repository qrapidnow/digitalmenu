import React, { useState } from 'react';
import './FoodItemCard.css';

const FoodItemCard = ({ item, addItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    console.log('Adding item:', item);
    addItem(item);
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="food-item-card">
      <div className="food-item-content">
        <img src={item.image} alt={item.name} className="food-item-image" />
        <div className="food-item-details">
          <h3 className="food-item-title">{item.name}</h3>
          <div className="food-item-price-add">
            <p className="food-item-price">₹{item.price}</p>
            <button onClick={handleAdd} className="add-button">Add</button>
          </div>
        </div>
      </div>
      <p className="food-item-description">
        {isExpanded ? item.description : `${item.description.substring(0, 50)}...`}
        {item.description.length > 50 && (
          <span className="read-more" onClick={toggleDescription}>
            {isExpanded ? ' Show Less' : ' Read More'}
          </span>
        )}
      </p>
    </div>
  );
};

export default FoodItemCard;
