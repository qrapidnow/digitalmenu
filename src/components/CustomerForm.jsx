import React, { useState } from 'react';
import './CustomerForm.css';

const CustomerForm = ({ setShowCustomerForm, setShowCartItem, saveCustomerData }) => {
    const [customerName, setCustomerName] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        saveCustomerData(customerName, whatsappNumber);
        setShowCustomerForm(false); // Hide the form
        setShowCartItem(true); // Show the cart
    };

    return (
        <div className="customer-form-container">
            <div className="customer-form">
                <h2>Customer Details</h2>
                <form onSubmit={handleFormSubmit}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                    <label htmlFor="whatsapp">WhatsApp Number:</label>
                    <input
                        type="text"
                        id="whatsapp"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        required
                    />
                    <button type="submit" className="action-button">Submit</button>
                    <p className="reward-message">Enter your name and WhatsApp to get 50% discount!</p>
                </form>
            </div>
        </div>
    );
};

export default CustomerForm;
