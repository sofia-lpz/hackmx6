import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inventario from './Inventario';
import Mensajes from './Mensajes';
import ProductList from './ProductList';
import ListadoVenta from './ListadoVentasMobile';
import ListaConfirmada from './ListaConfirmada';
import Proveedores from './Proveedores';
import ListaProductos from './ListaProductos';
import SubirFoto from './SubirFoto.jsx';
import './index.css';
import VoiceChat from './Voicechat';
import DataExtraction from './DataExtraction';
import { SpeechRecognitionProvider } from './SpeechRecognitionContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
    <SpeechRecognitionProvider>
      <Routes>
        <Route path="/" element={<VoiceChat />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ListaVentaMobile" element={<ListadoVenta />} />
        <Route path="/lista-confirmada" element={<ListaConfirmada />} />
        <Route path="/mensajes" element={<Mensajes />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/lista-productos" element={<ListaProductos />} />
        <Route path="/data-extraction" element={<DataExtraction />} />
        <Route path="/proveedores" element={<Proveedores />} />
      </Routes>
      </SpeechRecognitionProvider>
    </Router>
  </React.StrictMode>
);
