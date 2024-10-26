import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function ListadoVentasMobile() {
  const [productosData, setProductosData] = useState([]);
  const [carrito, setCarrito] = useState({});
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos');
        if (!response.ok) {
          throw new Error('Error al obtener productos');
        }
        const data = await response.json();
        setProductosData(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    const cantidadEnCarrito = carrito[producto.id] || 0;
    const cantidadMaxima = producto.cantidad; // Cantidad máxima disponible

    if (cantidadEnCarrito < cantidadMaxima) {
      setCarrito((prevCarrito) => ({
        ...prevCarrito,
        [producto.id]: cantidadEnCarrito + 1,
      }));
    } else {
      alert(`No se puede agregar más de ${cantidadMaxima} unidad/es de ${producto.nombre_producto}`);
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => {
      const nuevoCarrito = { ...prevCarrito };
      if (nuevoCarrito[id] > 1) {
        nuevoCarrito[id] -= 1;
      } else {
        delete nuevoCarrito[id];
      }
      return nuevoCarrito;
    });
  };

  const handleChange = (id, value) => {
    const cantidad = parseInt(value) || 0;
    const producto = productosData.find((p) => p.id === parseInt(id));
    const cantidadMaxima = producto ? producto.cantidad : 0;

    if (cantidad <= 0) {
      setCarrito((prevCarrito) => {
        const nuevoCarrito = { ...prevCarrito };
        delete nuevoCarrito[id];
        return nuevoCarrito;
      });
    } else if (cantidad > cantidadMaxima) {
      alert(`No se puede agregar más de ${cantidadMaxima} unidades de este producto.`);
    } else {
      setCarrito((prevCarrito) => ({
        ...prevCarrito,
        [id]: cantidad,
      }));
    }
  };

  const comprar = async () => {
    try {
      for (const id of Object.keys(carrito)) {
        const cantidad = carrito[id];
        const response = await fetch(`http://localhost:8080/api/productos/vender/${id}/${cantidad}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cantidad }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error al vender el producto con id ${id}`);
        }
      }
  
      alert('Compra realizada con éxito!');
      setCarrito({});
      navigate("/");
    } catch (error) {
      console.error(error);
      alert('Hubo un problema al realizar la compra. Inténtalo de nuevo.');
    }
  };
  
  const calcularTotal = () => {
    return Object.keys(carrito).reduce((acc, id) => {
      const producto = productosData.find((p) => p.id === parseInt(id));
      return acc + (producto.precio * carrito[id]);
    }, 0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-900 p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-white">Lista para Vender</h1>
      </header>
      
      <section>
        <h2 className="text-xl font-semibold text-white">Productos Disponibles</h2>
        <div className="grid gap-4 mt-4">
          {productosData.map(producto => (
            <div key={producto.id} className="border p-4 pl-6 rounded shadow flex items-center gap-2">
              <div className='flex-cols pr-12'>
                <h3 className="text-lg font-medium text-white">{producto.nombre_producto}</h3>
                <p className='text-white'>Precio: ${producto.precio.toFixed(2)}</p>
                <p className='text-white'>Stock: {producto.cantidad}</p>
              </div>
              <button 
                className="bg-red-500 text-white py-1 px-4 rounded w-11"
                onClick={() => eliminarDelCarrito(producto.id)}
              >-</button>
              <input
                type="number"
                value={carrito[producto.id] || 0}
                min="0"
                className="w-16 text-center border border-gray-300 rounded mx-1"
                onChange={(e) => handleChange(producto.id, e.target.value)}
                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
              />
              <button
                className="bg-green-500 text-white py-1 px-4 rounded w-11"
                onClick={() => agregarAlCarrito(producto)}
              >+</button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-white">Carrito de Compras</h2>
        <div className="mt-4 text-white">
          {Object.keys(carrito).length === 0 ? (
            <p>No hay productos en el carrito.</p>
          ) : (
            Object.keys(carrito).map((id) => {
              const producto = productosData.find(p => p.id === parseInt(id));
              return (
                <div key={id} className="flex justify-between items-center border-b py-2">
                  <span>{producto.nombre_producto} - ${producto.precio.toFixed(2)} x {carrito[id]}</span>
                  <button 
                    className="text-red-500 font-bold"
                    onClick={() => 
                      setCarrito((prevCarrito) => {
                        const nuevoCarrito = { ...prevCarrito };
                        delete nuevoCarrito[id];
                        return nuevoCarrito;
                      })
                    }
                  >
                    Eliminar
                  </button>
                </div>
              );
            })
          )}
        </div>
        {Object.keys(carrito).length > 0 && (
          <div className="flex items-center mt-4">
            <button 
              className="bg-blue-800 text-white py-2 px-4 rounded mr-4"
              onClick={comprar}
            >
              Comprar
            </button>
            <p>Total: ${calcularTotal().toFixed(2)}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default ListadoVentasMobile;
