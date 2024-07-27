import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <Routes>
      <Route path="/:uid" element={<App />} />
    </Routes>
  </Router>
);
