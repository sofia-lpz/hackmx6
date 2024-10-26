import React from 'react';
import { useNavigate } from 'react-router-dom';

function Inventario() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 p-4">
      <h1 className="text-5xl font-bold text-white mb-4 py-30">¡Bienvenido a tu asistente de inventario!</h1>
      <h1 className="text-3xl font-bold text-white mb-4">¿Cómo quieres ingresar tu inventario?</h1>
      <div className="flex flex-col sm:flex-row gap-4 mt-5">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded w-full sm:w-auto"
          onClick={() => navigate('/subir-foto')}
        >
          <b>Tomar una foto:</b> Sube una foto de tu inventario escrito a mano
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          onClick={() => navigate('/messages')}
        >
          <b>Escribir inventario:</b> Habla con un asistente para introducir tu inventario
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          onClick={() => alert('Mock: Input inventory through voice commands')}
        >
          <b>Inventario por comandos de voz:</b> Habla para introducir tu inventario
        </button>
        <button
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          onClick={() => navigate('/lista-productos')}
        >
          <b>Ver inventario:</b> Consulta lo que actualmente existe en tu inventario
        </button>
      </div>
    </div>
  );
}

export default Inventario;