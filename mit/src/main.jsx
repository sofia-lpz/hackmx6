import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inventario from './inventario';
import Mensajes from './Mensajes';
import ProductList from './ProductList';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Inventario />} />
        <Route path="/messages" element={<Mensajes />} />
        <Route path="/product-list" element={<ProductList />} />
      </Routes>
    </Router>
  </React.StrictMode>
);