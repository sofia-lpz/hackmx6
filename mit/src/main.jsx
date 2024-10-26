import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Inventario from './Inventario';
import Mensajes from './Mensajes';
import ProductList from './ProductList';
import './index.css';
import VoiceChat from './Voicechat';
import DataExtraction from './DataExtraction';
import { SpeechRecognitionProvider } from './SpeechRecognitionContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SpeechRecognitionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<VoiceChat />} />
          <Route path="/Inventario" element={<Inventario />} />
          <Route path="/messages" element={<Mensajes />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/data-extraction" element={<DataExtraction />} />
        </Routes>
      </Router>
    </SpeechRecognitionProvider>
  </React.StrictMode>
);