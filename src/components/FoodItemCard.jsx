import React, { useState } from 'react';
import './FoodItemCard.css';

const FoodItemCard = ({ item, addItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAdd = (e, variation = null) => {
    e.stopPropagation();
    console.log('Adding item:', item, 'Variation:', variation);
    addItem(item, variation);
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="food-item-card">
      <div className="food-item-content">
        {item.image && (
          <img src={item.image} alt={item.name} className="food-item-image" />
        )}
        <div className="food-item-details">
          <h3 className="food-item-title">{item.name}</h3>
          {item.variations && item.variations.length > 0 ? (
            <>
              <p className="food-item-description">
                {isExpanded ? item.description : `${item.description.substring(0, 50)}...`}
                {item.description.length > 50 && (
                  <span className="read-more" onClick={toggleDescription}>
                    {isExpanded ? ' Show Less' : ' Read More'}
                  </span>
                )}
              </p>
              {item.variations.map((variation, index) => (
                <div key={index} className="food-item-variation">
                  <div className="food-item-price-add">
                    <p className="food-item-price">
                      {variation.name}: ₹{variation.price}
                    </p>
                    <button
                      onClick={(e) => handleAdd(e, variation)}
                      className="add-button"
                    >
                      Add
                    </button>
                  </div>
                  <p className="variation-description">
                    {variation.description}
                  </p>
                  <p className="variation-weight">
                    Weight: {variation.weight} {variation.unit}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="food-item-price-add">
                <p className="food-item-price">₹{item.price}</p>
                <button onClick={(e) => handleAdd(e)} className="add-button">
                  Add
                </button>
              </div>
              <p className="food-item-weight">
                Weight: {item.weight} {item.unit}
              </p>
            </>
          )}
        </div>
      </div>
      {!item.variations || item.variations.length === 0 ? (
        <p className="food-item-description">
          {isExpanded ? item.description : `${item.description.substring(0, 50)}...`}
          {item.description.length > 50 && (
            <span className="read-more" onClick={toggleDescription}>
              {isExpanded ? ' Show Less' : ' Read More'}
            </span>
          )}
        </p>
      ) : null}
    </div>
  );
};

export default FoodItemCard;
