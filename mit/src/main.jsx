import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inventario from './inventario';
import Mensajes from './Mensajes';
import ProductList from './ProductList';
import ListaProductos from './ListaProductos';
import SubirFoto from './SubirFoto.jsx';
import VerProveedores from './VerProveedores.jsx';
import VerVentas from './VerVentas.jsx';
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
        <Route path="/ver-proveedores" element={<VerProveedores />} />
        <Route path="/ver-ventas" element={<VerVentas />} />
      </Routes>
    </Router>
  </React.StrictMode>
);