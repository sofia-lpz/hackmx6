import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function ProductList() {
  const location = useLocation();
  const [products, setProducts] = useState(location.state?.products || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductAmount, setNewProductAmount] = useState(1);

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
    updatedProducts[index].amount += 1;
    setProducts(updatedProducts);
  };

  const handleDecrease = (index) => {
    const updatedProducts = [...products];
    if (updatedProducts[index].amount > 1) {
      updatedProducts[index].amount -= 1;
      setProducts(updatedProducts);
    }
  };

  const handleAddProduct = () => {
    if (newProductName.trim()) {
      setProducts([...products, { name: newProductName, amount: newProductAmount }]);
      setNewProductName('');
      setNewProductAmount(1);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Product List</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a product..."
        className="border p-2 w-full mb-4"
      />
      <div className="border p-4 w-full sm:w-80 h-96 overflow-y-auto mb-4 flex flex-col">
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
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center w-full sm:w-80">
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="New product name"
          className="border p-2 w-full mb-2"
        />
        <div className="flex items-center mb-4">
          <button
            onClick={() => setNewProductAmount((prev) => Math.max(1, prev - 1))}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          >
            -
          </button>
          <span className="mx-2">{newProductAmount}</span>
          <button
            onClick={() => setNewProductAmount((prev) => prev + 1)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}

export default ProductList;