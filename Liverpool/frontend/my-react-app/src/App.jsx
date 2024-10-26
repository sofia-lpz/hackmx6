// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

function App() {
  return (
    <div>
      <div className="image-gallery">
        <div className="image selected">Imagen cargada</div>
        <div className="image">Imagen</div>
        <div className="image">Imagen</div>
        <div className="image">Imagen</div>
        <div className="image">Imagen</div>
        <div className="image">Imagen</div>
        <div className="image">Imagen</div>
        <div className="image">Imagen</div>
        <div className="image">Imagen</div>
      </div>
      <button className="upload-button">Botón para subir imagen</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
