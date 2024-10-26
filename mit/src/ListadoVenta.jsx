import React, { useState } from 'react';

const productosData = [
    { id: 1, nombre: "Producto 1", precio: 100 },
    { id: 2, nombre: "Producto 2", precio: 150 },
    { id: 3, nombre: "Producto 3", precio: 200 },
    { id: 4, nombre: "Producto 4", precio: 250 },
    { id: 5, nombre: "Producto 5", precio: 300 },
];

function ListadoVenta() {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  };

  const comprar = () => {
    alert('Compra realizada con éxito!');
    setCarrito([]);
  };

  return (
    <div className="p-16">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Lista para Vender</h1>
      </header>
      
      <section>
        <h2 className="text-xl font-semibold">Productos Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {productosData.map(producto => (
            <div key={producto.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-medium">{producto.nombre}</h3>
              <p>Precio: ${producto.precio}</p>
              <button 
                className="mt-2 bg-green-500 text-white py-1 px-4 rounded"
                onClick={() => agregarAlCarrito(producto)}
              >
                Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Carrito de Compras</h2>
        <div className="mt-4">
          {carrito.length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            carrito.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b py-2">
                <span>{item.nombre} - ${item.precio}</span>
                <button 
                  className="text-red-500 font-bold"
                  onClick={() => eliminarDelCarrito(index)}
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>
        {carrito.length > 0 && (
            <div className="flex items-center mt-4">
                <button 
                    className="bg-blue-800 text-white py-2 px-4 rounded mr-4"
                    onClick={comprar}
                >
                    Comprar
                </button>
                <p>Total: ${carrito.reduce((acc, item) => acc + item.precio, 0)}</p>
            </div>
        )}
      </section>
    </div>
  );
}

export default ListadoVenta;
