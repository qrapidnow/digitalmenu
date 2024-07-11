import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Navbar from './components/NavBar';
import Menu from './components/Menu';
import CartItem from './components/CartItem';
import axios from 'axios';

const App = () => {
  const [cart, setCart] = useState([]);
  const [showCartItem, setShowCartItem] = useState(false);
  const [showPlaceOrderPage, setShowPlaceOrderPage] = useState(false);
  const [foodItemCounts, setFoodItemCounts] = useState({});
  const [restaurantName, setRestaurantName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const backendApiUrl = import.meta.env.VITE_APP_BASE_BACKEND_API;

    const fetchUsersAndToken = async () => {
      try {
        const usersResponse = await axios.get(`${backendApiUrl}/users`);
        console.log('Users response:', usersResponse.data);
        const users = usersResponse.data;
        if (users && users.length > 0) {
          const firstUserId = users[0]._id;
          const tokenResponse = await axios.get(`${backendApiUrl}/token/${firstUserId}`);
          console.log('Token response:', tokenResponse.data);
          const token = tokenResponse.data.token;
          if (token) {
            localStorage.setItem('token', token);
            const restaurantResponse = await fetchRestaurant(token);
            console.log('Restaurant response:', restaurantResponse);
            if (restaurantResponse && restaurantResponse._id) {
              localStorage.setItem('restaurantId', restaurantResponse._id);
              console.log('Set restaurantId in localStorage:', restaurantResponse._id);
            }
          }
        } else {
          console.error('No users found');
        }
      } catch (error) {
        console.error('Error fetching users or token:', error);
      }
    };

    fetchUsersAndToken();
  }, []);

  const fetchRestaurant = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BASE_BACKEND_API}/restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched restaurant data:', response.data);
      setRestaurantName(response.data.name);
      setIsLoggedIn(true);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    }
  };

  const addItem = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    updateItemCount(item.id, 1);
  };

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  const handleViewOrderClick = () => {
    setShowCartItem(true);
    setShowPlaceOrderPage(false);
  };

  const handleCartClick = () => {
    setShowCartItem(true);
    setShowPlaceOrderPage(false);
  };

  const removeItem = (itemToRemove) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemToRemove.id));
    updateItemCount(itemToRemove.id, -itemToRemove.quantity);
    setShowCartItem(true); // Update the cart item count display
  };

  const updateItemCount = (itemId, countChange) => {
    setFoodItemCounts((prevCounts) => {
      const currentCount = prevCounts[itemId] || 0;
      const newCount = Math.max(0, currentCount + countChange);
      const updatedCart = cart.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: newCount };
        }
        return item;
      });
      setCart(updatedCart);
      return { ...prevCounts, [itemId]: newCount };
    });
  };

  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Header restaurantName={restaurantName} />
      <div className="search-cart-container">
        <SearchBar />
        <button className="cart-button" onClick={handleCartClick}>🛒</button>
      </div>
      <Navbar setActiveCategory={setActiveCategory} /> {/* Added setActiveCategory prop */}
      <div className="content-container">
        <Menu addItem={addItem} updateItemCount={updateItemCount} activeCategory={activeCategory} />
      </div>
      {getTotalItems() > 0 && (
        <div className="view-order-bar" onClick={handleViewOrderClick}>
          <span>View Order</span>
          <span className="order-count">{getTotalItems()}</span>
        </div>
      )}
      {showCartItem && (
        <CartItem
          cartItems={cart}
          setCart={setCart}
          removeItem={removeItem}
          setShowCartItem={setShowCartItem}
          updateItemCount={updateItemCount}
        />
      )}
      {showPlaceOrderPage && (
        <PlaceOrderPage cartItems={cart} setShowPlaceOrderPage={setShowPlaceOrderPage} />
      )}
    </div>
  );
};

export default App;
