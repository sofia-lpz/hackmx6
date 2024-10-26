import React, { useState, useEffect } from 'react';
import Notification from './Notification';

function VerVentas() {
  const [ventas, setVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productosStockProximoAAgotarse, setProductosStockProximoAAgotarse] = useState([]);

  const nombresProductos = productosStockProximoAAgotarse
    .filter(producto => producto.cantidad <= 1) // Filtra productos con cantidad 0 o 1
    .map(producto => producto.nombre_producto);

  useEffect(() => {
    // Set the document title
    document.title = 'Inventario - Asistente';

    // Function to fetch all sales (ventas)
    const fetchVentas = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          const fetchedVentas = data.map((venta) => ({
            id: venta.id,
            nombreProducto: venta.nombre_producto,
            cantidad: venta.cantidad,
            unidad: venta.unidad,
            precio: venta.precio,
            proveedorId: venta.proveedor_id,
          }));
          setVentas(fetchedVentas);
        } else {
          console.error('Expected an array but got:', data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    // Function to fetch products with low stock
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos_stock_proximo_a_acabarse');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProductosStockProximoAAgotarse(data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchVentas();
    fetchProductos();
  }, []);

  const filteredVentas = ventas.filter((venta) =>
    venta.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteVenta = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setVentas(ventas.filter((venta) => venta.id !== id));
          alert('Venta eliminada correctamente');
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error al eliminar la venta:', error);
        alert('Hubo un error al eliminar la venta.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-900 p-4">
      <Notification productos={nombresProductos} />
      <h1 className="text-2xl font-bold text-white mb-4">Lista de Ventas</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Busca una venta por nombre de producto..."
        className="border p-2 w-full sm:w-80 mb-4"
      />
      <div className="w-full sm:w-96 lg:w-1/2 h-96 lg:h-[50vh] overflow-y-auto mb-4 flex flex-col space-y-4">
        {/* Ventas list */}
        {filteredVentas.map((venta) => (
          <div key={venta.id} className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <div className="text-left space-y-2">
              <div>
                <strong>ID de la Venta:</strong> {venta.id}
              </div>
              <div>
                <strong>Nombre del Producto:</strong> {venta.nombreProducto}
              </div>
              <div>
                <strong>Cantidad:</strong> {venta.cantidad} {venta.unidad}
              </div>
              <div>
                <strong>Precio:</strong> ${venta.precio.toFixed(2)}
              </div>
              <div>
                <strong>ID del Proveedor:</strong> {venta.proveedorId}
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => deleteVenta(venta.id)}
                className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-4 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => (window.location.href = '/')}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-2"
      >
        Regresar a inicio
      </button>
    </div>
  );
}

export default VerVentas;