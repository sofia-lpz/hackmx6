import React, { useState, useEffect } from 'react';

function VerProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/proveedores');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          const fetchedProveedores = data.map((proveedor) => ({
            id: proveedor.id,
            name: proveedor.nombre,
            phone: proveedor.telefono,
            period: proveedor.periodo,
            lastDate: new Date(proveedor.ultima_fecha).toLocaleDateString(),
            daysSinceLastDate: proveedor.pasaron_ultima_fecha,
          }));
          setProveedores(fetchedProveedores);
        } else {
          console.error('Expected an array but got:', data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchProveedores();
  }, []);

  const filteredProveedores = proveedores.filter((proveedor) =>
    proveedor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteProveedor = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/proveedores/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProveedores(proveedores.filter((proveedor) => proveedor.id !== id));
          alert('Proveedor eliminado correctamente');
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error al eliminar el proveedor:', error);
        alert('Hubo un error al eliminar el proveedor.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Lista de Proveedores</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Busca un proveedor..."
        className="border p-2 w-full sm:w-80 mb-4"
      />
      <div className="w-full sm:w-96 lg:w-1/2 h-96 lg:h-[50vh] overflow-y-auto mb-4 flex flex-col space-y-4">
        {/* Proveedores list */}
        {filteredProveedores.map((proveedor) => (
          <div key={proveedor.id} className="bg-gray-800 text-white p-4 rounded-lg shadow-lg">
            <div className="text-left space-y-2">
              <div>
                <strong>Nombre:</strong> {proveedor.name}
              </div>
              <div>
                <strong>Teléfono:</strong> {proveedor.phone}
              </div>
              <div>
                <strong>Periodo:</strong> {proveedor.period}
              </div>
              <div>
                <strong>Última Fecha:</strong> {proveedor.lastDate}
              </div>
              <div>
                <strong>Días desde última fecha:</strong> {proveedor.daysSinceLastDate ? 'Sí' : 'No'}
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={() => deleteProveedor(proveedor.id)}
                className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-4 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => window.location.href = '/'}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-2"
      >
        Regresar a inicio
      </button>
    </div>
  );
}

export default VerProveedores;
