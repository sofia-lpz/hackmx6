import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ProductList() {
  const location = useLocation();
  const [products, setProducts] = useState(
    location.state?.products?.map((product) => ({
      ...product,
      amount: Number(product.amount) || 1,
      price: product.price || 0,
      provider: product.provider || '',
    })) || []
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductProvider, setNewProductProvider] = useState('');

  const handleDelete = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleEdit = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  const handleIncrease = (index) => {
    const updatedProducts = [...products];
    updatedProducts[index].amount = (Number(updatedProducts[index].amount) || 0) + 1;
    setProducts(updatedProducts);
  };

  const handleDecrease = (index) => {
    const updatedProducts = [...products];
    const currentAmount = Number(updatedProducts[index].amount) || 1;
    if (currentAmount > 1) {
      updatedProducts[index].amount = currentAmount - 1;
      setProducts(updatedProducts);
    }
  };

  const handleAddProduct = () => {
    if (newProductName.trim() && newProductPrice.trim() && newProductProvider.trim()) {
      const newProduct = {
        name: newProductName,
        amount: 1,
        price: parseFloat(newProductPrice),
        provider: newProductProvider,
      };
      setProducts([...products, newProduct]);
      setNewProductName('');
      setNewProductPrice('');
      setNewProductProvider('');
    }
  };

  const handleSaveProducts = async () => {
    try {
      // Map products to match the database structure precisely
      const parsedProducts = products.map((product) => ({
        nombre_producto: product.name,          // Match the database field for product name
        cantidad: product.amount,               // Should match 'cantidad' in DB
        gramos_por_unidad: product.unit || 0,   // Adjust as needed
        precio: parseFloat(product.price),      // Ensure the price is a float
        proveedor_id: product.providerId        // Ensure this is the actual ID if needed
      }));
  
      // Send each product to the backend individually
      for (const product of parsedProducts) {
        await axios.post('/api/productos', product);
      }
  
      alert('Productos guardados exitosamente');
    } catch (error) {
      console.error('Error saving products:', error);
      alert('Error al guardar productos');
    }
  };  

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Lista de productos</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Busca un producto..."
        className="border p-2 w-full sm:w-80 mb-4 text-black placeholder-gray-500"
      />
      <div className="border p-4 w-full sm:w-96 lg:w-1/2 h-96 lg:h-[50vh] overflow-y-auto mb-4 flex flex-col">
        {filteredProducts.map((product, index) => (
          <div key={index} className="bg-gray-800 text-white p-2 rounded-lg mb-2 flex flex-col items-start w-full">
            <div className="flex items-center mb-2">
              <button
                onClick={() => handleDecrease(index)}
                className="bg-red-500 text-m hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
              >
                -
              </button>
              <span className="mx-2">{product.amount}</span>
              <button
                onClick={() => handleIncrease(index)}
                className="bg-green-500 text-m hover:bg-green-700 text-white font-bold py-2 px-3 rounded"
              >
                +
              </button>
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <span>{product.name}</span>
              <input
                type="number"
                value={product.price}
                onChange={(e) => handleEdit(index, 'price', e.target.value)}
                placeholder="Precio"
                className="border p-2 w-full mb-2 text-black placeholder-gray-500"
              />
              <input
                type="text"
                value={product.provider}
                onChange={(e) => handleEdit(index, 'provider', e.target.value)}
                placeholder="Proveedor"
                className="border p-2 w-full mb-2 text-black placeholder-gray-500"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center w-full sm:w-96 lg:w-1/2">
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Ingresa un nuevo producto..."
          className="border p-2 w-full mb-2 text-black placeholder-gray-500"
        />
        <input
          type="number"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(e.target.value)}
          placeholder="Precio"
          className="border p-2 w-full mb-2 text-black placeholder-gray-500"
        />
        <input
          type="text"
          value={newProductProvider}
          onChange={(e) => setNewProductProvider(e.target.value)}
          placeholder="Proveedor"
          className="border p-2 w-full mb-2 text-black placeholder-gray-500"
        />
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
        >
          Agregar Producto
        </button>
      </div>

      <button
        onClick={handleSaveProducts}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-2"
      >
        Guardar
      </button>
      <button
        onClick={() => window.location.href = '/'}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-2"
      >
        Regresar a inicio
      </button>
      <button
        onClick={() => window.location.href = '/messages'}
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto mt-2"
      >
        Regresar a chatbot
      </button>
    </div>
  );
}

export default ProductList;