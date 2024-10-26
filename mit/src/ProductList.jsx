import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function ProductList() {
  const location = useLocation();
  const [products, setProducts] = useState(
    location.state?.products?.map((product) => ({
      ...product,
      amount: Number(product.amount) || 1,
    })) || []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductAmount] = useState(1); // Fixed amount of 1 for new products

  const handleDelete = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleEdit = (index, newName) => {
    const updatedProducts = [...products];
    updatedProducts[index].name = newName;
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
    if (newProductName.trim()) {
      setProducts([...products, { name: newProductName, amount: newProductAmount }]);
      setNewProductName('');
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
        className="border p-2 w-full sm:w-80 mb-4"
      />
      <div className="border p-4 w-full sm:w-96 lg:w-1/2 h-96 lg:h-[50vh] overflow-y-auto mb-4 flex flex-col">
        {filteredProducts.map((product, index) => (
          <div key={index} className="bg-gray-800 text-white p-2 rounded-lg mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => handleDecrease(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                -
              </button>
              <span className="mx-2">{product.amount}</span>
              <button
                onClick={() => handleIncrease(index)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
              >
                +
              </button>
            </div>
            <input
              type="text"
              value={product.name}
              onChange={(e) => handleEdit(index, e.target.value)}
              className="bg-gray-700 text-white p-1 rounded mx-2"
            />
            <button
              onClick={() => handleDelete(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
            >
              Borrar
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center w-full sm:w-96 lg:w-1/2">
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Ingresa un nuevo producto..."
          className="border p-2 w-full mb-4"
        />
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
        >
          Agregar Producto
        </button>
      </div>
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
