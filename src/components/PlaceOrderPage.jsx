import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './PlaceOrderPage.css';

const PlaceOrderPage = ({ cartItems, setShowPlaceOrderPage }) => {
  // const [name, setName] = useState('');
  // const [whatsapp, setWhatsapp] = useState('');
  // const [tableNo, setTableNo] = useState('');
  // const [isLoading, setIsLoading] = useState(false);

  // const handleSubmitOrder = async (event) => {
  //   event.preventDefault();
  //   setIsLoading(true);

  //   const orderData = {
  //     name,
  //     whatsapp,
  //     tableNo,
  //     items: cartItems.map(item => ({
  //       name: item.name,
  //       price: item.price,
  //       quantity: item.quantity,
  //     })),
  //   };

  //   console.log("Attempting to send order data:", orderData); // Log data being sent

  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_APP_BASE_CUSTOMER_BACKEND_API}/orders`,
  //       orderData,
  //       { headers: { 'Content-Type': 'application/json' } }
  //     );
  //     console.log("Order response data:", response.data); // Log response data
  //     Swal.fire({
  //       title: 'Order Placed Successfully!',
  //       text: 'Your order has been placed.',
  //       icon: 'success',
  //       confirmButtonText: 'OK'
  //     });
  //     setShowPlaceOrderPage(false);
  //   } catch (error) {
  //     console.error('Error sending order:', error);
  //     if (error.response) {
  //       // Log details of response error if it exists
  //       console.error('Response data:', error.response.data);
  //       console.error('Response status:', error.response.status);
  //     }
  //     Swal.fire({
  //       title: 'Failed to Place Order',
  //       text: 'Please try again.',
  //       icon: 'error',
  //       confirmButtonText: 'OK'
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // return (
  //   <div className="place-order-container">
  //     <h2 className="place-order-title">Place Your Order</h2>
  //     {isLoading ? (
  //       <div className="loading-indicator">
  //         <div className="spinner"></div>
  //         <p>Please wait...</p>
  //       </div>
  //     ) : (
  //       <form className="place-order" onSubmit={handleSubmitOrder}>
  //         <label htmlFor="tableNo">Table Number:</label>
  //         <input
  //           type="text"
  //           id="tableNo"
  //           name="tableNo"
  //           required
  //           value={tableNo}
  //           onChange={(e) => setTableNo(e.target.value)}
  //         />

  //         <label htmlFor="name">Name:</label>
  //         <input
  //           type="text"
  //           id="name"
  //           name="name"
  //           required
  //           value={name}
  //           onChange={(e) => setName(e.target.value)}
  //         />

  //         <label htmlFor="whatsapp">WhatsApp Number:</label>
  //         <input
  //           type="text"
  //           id="whatsapp"
  //           name="whatsapp"
  //           required
  //           value={whatsapp}
  //           onChange={(e) => setWhatsapp(e.target.value)}
  //         />

  //         <button type="submit" className="place-order-button">Submit Order</button>
  //       </form>
  //     )}
  //     <button className="back-button" onClick={() => setShowPlaceOrderPage(false)}>Back to Cart</button>
  //   </div>
  // );
};

export default PlaceOrderPage;
