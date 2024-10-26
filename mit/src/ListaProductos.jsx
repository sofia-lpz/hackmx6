import React, { useState, useEffect } from 'react';

function ListaProductos() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/productos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          const fetchedProducts = data.map((product) => ({
            id: product.id,
            name: product.nombre_producto,
            amount: product.cantidad.toFixed(2), // Rounded to two decimals
            unit: product.gramos_por_unidad ? 'g' : 'kg',
            price: product.precio.toFixed(2), // Rounded to two decimals
          }));
          setProducts(fetchedProducts);
        } else {
          console.error('Expected an array but got:', data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to delete a product
  const deleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProducts(products.filter((product) => product.id !== id));
          alert('Producto eliminado correctamente');
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('Hubo un error al eliminar el producto.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Lista de productos</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Busca un producto..."
        className="border p-2 w-full sm:w-80 mb-4"
      />
      <div className="border p-4 w-full sm:w-96 lg:w-1/2 h-96 lg:h-[50vh] overflow-y-auto mb-4 flex flex-col">
        {/* Header row */}
        <div className="flex justify-between items-center bg-gray-700 text-white p-2 rounded-t-lg font-semibold">
          <div className="flex-1 text-center text-xs">Cantidad</div>
          <div className="flex-1 text-center text-xs">Producto</div>
          <div className="flex-1 text-center text-sm">Unidad</div>
          <div className="flex-1 text-center text-sm">Precio ($)</div>
          <div className="flex-1 text-center text-sm">Acciones</div>
        </div>
        {/* Products list */}
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-gray-800 text-white p-2 rounded-lg mb-2 flex justify-between items-center text-center">
            <div className="flex-1">{product.amount}</div>
            <div className="flex-1">{product.name}</div>
            <div className="flex-1">{product.unit}</div>
            <div className="flex-1">${product.price}</div>
            <div className="flex-1">
              <button 
                onClick={() => deleteProduct(product.id)}
                className="bg-red-500  hover:bg-red-700 text-white text-sm font-bold py-1 px-1 rounded"
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

export default ListaProductos;
