import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import App from './App';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/:userId" element={<App />} /> {/* Use element instead of component */}
    </Routes>
  </Router>,
  document.getElementById('root')
);
