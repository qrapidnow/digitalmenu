import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './PlaceOrderPage.css';

const PlaceOrderPage = ({ cartItems, setShowPlaceOrderPage, setShowMenuPage }) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSubmitOrder = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading to true when order submission starts

    const orderData = {
      name,
      whatsapp,
      tableNo,
      items: cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity, // Add quantity here
      })),
    };

    console.log('Order data to be sent:', orderData);
    console.log('Environment Variable:', import.meta.env.VITE_APP_BASE_CUSTOMER_BACKEND_API);

    try {
      console.log('Attempting to send order data to backend...');
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_CUSTOMER_BACKEND_API}/orders`,
        orderData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Order saved:', response.data);
      Swal.fire({
        title: 'Order Placed Successfully!',
        text: 'Your order has been placed.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      setShowPlaceOrderPage(false); // Close the order page
      setShowMenuPage(true); // Open the menu page
    } catch (error) {
      console.error('Error saving order:', error);
      if (error.response) {
        console.log('Error data:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
      } else if (error.request) {
        console.log('Error request:', error.request);
      } else {
        console.log('Error message:', error.message);
      }
      Swal.fire({
        title: 'Failed to Place Order',
        text: 'Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false); // Set loading to false after order submission completes
    }
  };

  return (
    <div className="place-order-container">
      <h2 className="place-order-title">Place Your Order</h2>
      {isLoading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Please wait...</p>
        </div>
      ) : (
        <form className="place-order" onSubmit={handleSubmitOrder}>
          <label htmlFor="tableNo">Table Number:</label>
          <input
            type="text"
            id="tableNo"
            name="tableNo"
            required
            value={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
          />

          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="whatsapp">WhatsApp Number:</label>
          <input
            type="text"
            id="whatsapp"
            name="whatsapp"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          <button type="submit" className="place-order-button">Submit Order</button>
        </form>
      )}
      {!isLoading && <button className="back-button" onClick={() => setShowPlaceOrderPage(false)}>Back to Cart</button>}
    </div>
  );
};

export default PlaceOrderPage;
