import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import store from './redux/store';
import FinancialApp from './components/FinancialApp';
import StoragePage from './components/StoragePage';
import Login from './components/Login'; // Vérifie que ce fichier existe

const container = document.getElementById('root');
if (!container) {
  throw new Error('Element with id "root" not found!');
}

const root = createRoot(container);

root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<FinancialApp />} />
        <Route path="/storage" element={<StoragePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  </Provider>
);
