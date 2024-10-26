import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inventario from './inventario';
import Mensajes from './Mensajes';
import ProductList from './ProductList';
import ListaProductos from './ListaProductos';
import SubirFoto from './SubirFoto.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Inventario />} />
        <Route path="/messages" element={<Mensajes />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/lista-productos" element={<ListaProductos />} />
        <Route path="/subir-foto" element={<SubirFoto />} />
      </Routes>
    </Router>
  </React.StrictMode>
);