import React from 'react';
import { useNavigate } from 'react-router-dom';

function Inventario() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Introduce tu inventario o tu lista</h1>
      <div className="flex flex-col sm:flex-row gap-4 mt-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded w-full sm:w-auto"
          onClick={() => alert('Mock: Take a picture of your inventory note')}
        >
          Tomar una foto
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          onClick={() => navigate('/messages')}
        >
          Escribir inventario
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          onClick={() => alert('Mock: Input inventory through voice commands')}
        >
          Inventario por comandos de voz
        </button>
      </div>
    </div>
  );
}

export default Inventario;