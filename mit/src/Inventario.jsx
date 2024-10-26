import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';

function Inventario() {
  const navigate = useNavigate();

  const header1Props = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 },
  });

  const header2Props = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 },
    delay: 500,
  });

  const buttonProps = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { duration: 1000 },
    delay: 1000,
  });

  useEffect(() => {
    document.title = 'Inventario - Asistente';
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 p-4">
      <animated.h1 style={header1Props} className="text-5xl font-bold text-white mb-4 py-30">
        ¡Bienvenido a tu asistente de inventario!
      </animated.h1>
      <animated.h1 style={header2Props} className="text-3xl font-bold text-white mb-4">
        ¿Cómo quieres ingresar tu inventario?
      </animated.h1>
      <div className="flex flex-col sm:flex-row gap-4 mt-5">
        <animated.button
          style={buttonProps}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded w-full sm:w-auto"
          onClick={() => navigate('/subir-foto')}
        >
          <b>Tomar una foto:</b> Sube una foto de tu inventario escrito a mano
        </animated.button>
        <animated.button
          style={buttonProps}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          onClick={() => navigate('/messages')}
        >
          <b>Escribir inventario:</b> Habla con un asistente para introducir tu inventario
        </animated.button>
        <animated.button
          style={buttonProps}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          onClick={() => alert('Mock: Input inventory through voice commands')}
        >
          <b>Inventario por comandos de voz:</b> Habla para introducir tu inventario
        </animated.button>
        <animated.button
          style={buttonProps}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          onClick={() => navigate('/lista-productos')}
        >
          <b>Ver inventario:</b> Consulta lo que actualmente existe en tu inventario
        </animated.button>
      </div>
    </div>
  );
}

export default Inventario;