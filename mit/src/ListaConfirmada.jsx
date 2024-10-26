import React, { useState } from 'react';

const ListaConfirmada = () => {
    const [items, setItems] = useState([
        {
            "nombre_producto": "Naranja",
            "cantidad": 5,
            "unidad": "g",
            "precio": 0.4,
            "proveedor_id": 2
        },
        {
            "nombre_producto": "Manzana",
            "cantidad": 10,
            "unidad": "g",
            "precio": 0.5,
            "proveedor_id": 2
        },
        {
            "nombre_producto": "Pera",
            "cantidad": 3,
            "unidad": "g",
            "precio": 0.3,
            "proveedor_id": 1
        }
    ]);

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre_producto: '',
        cantidad: 0,
        unidad: '',
        precio: 0,
        proveedor_id: null,
    });

    const [formVisible, setFormVisible] = useState(false);
    const [proveedores, setProveedores] = useState([]);

    // Fetch proveedores cuando el componente se monte
    React.useEffect(() => {
        const fetchProveedores = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/proveedores');
                if (!response.ok) {
                    throw new Error('Error al obtener proveedores');
                }
                const data = await response.json();
                setProveedores(data);
            } catch (error) {
                console.error('Error fetching proveedores:', error);
            }
        };

        fetchProveedores();
    }, []);

    const handleChange = (index, field, value) => {
        setItems(prevItems =>
            prevItems.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const handleNuevoProductoChange = (e) => {
        const { name, value } = e.target;
        setNuevoProducto((prev) => ({ ...prev, [name]: value }));
    };

    const agregarNuevoProducto = () => {
        setItems((prevItems) => [...prevItems, nuevoProducto]);
        setNuevoProducto({ nombre_producto: '', cantidad: 0, unidad: '', precio: 0, proveedor_id: null });
        setFormVisible(false);
    };

    const confirmarCompra = async () => {
        alert('Compra confirmada');
        try {
            for (const item of items) {
                const jsonBody = JSON.stringify(item);
                console.log('Enviando los siguientes datos:', jsonBody);

                const response = await fetch('http://localhost:8080/api/productos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: jsonBody,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error al vender el producto:', errorText);
                    throw new Error(`Error al vender el producto ${item.nombre_producto}`);
                }
            }

            alert('Compra realizada con éxito!');
        } catch (error) {
            console.error('Error en la función confirmarCompra:', error);
            alert('Ocurrió un error al confirmar la compra.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-900 p-4">
            <div className="w-11/12 max-w-md bg-white p-5 shadow-lg rounded-lg">
                <h1 className="text-2xl mb-5 text-center">Esto fue lo que entendí...</h1>
                <p className='text-center'>¿Está todo en orden?</p>
                <p className="text-center mb-5">Logramos identificar: {items.reduce((acc, item) => acc + item.cantidad, 0)} elementos</p>
                <ul className="list-none p-0 m-0 mb-5">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center justify-between p-2 border-b border-gray-300">
                            <span>{item.nombre_producto}</span>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={item.cantidad}
                                    min="0"
                                    className="w-10 text-center border border-gray-300 rounded mx-1"
                                    onChange={(e) => handleChange(index, 'cantidad', parseInt(e.target.value) || 0)}
                                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                />
                                <input
                                    type="text"
                                    value={item.unidad}
                                    className="w-8 text-center border border-gray-300 rounded mx-1"
                                    onChange={(e) => handleChange(index, 'unidad', e.target.value)}
                                    placeholder="Unidad"
                                />
                                <input
                                    type="number"
                                    value={item.precio}
                                    min="0"
                                    className="w-8 text-center border border-gray-300 rounded mx-1"
                                    onChange={(e) => handleChange(index, 'precio', parseFloat(e.target.value) || 0)}
                                    placeholder="Precio"
                                />
                                <select
                                    value={item.proveedor_id}
                                    onChange={(e) => handleChange(index, 'proveedor_id', parseInt(e.target.value) || 0)}
                                    className="border border-gray-300 rounded mx-1"
                                >
                                    <option value="" disabled>Proveedor</option>
                                    {proveedores.map((proveedor) => (
                                        <option key={proveedor.id} value={proveedor.id}>
                                            {proveedor.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Botón para agregar nuevo producto */}
                <button
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setFormVisible(!formVisible)}
                >
                    {formVisible ? 'Cancelar' : 'Agregar Producto'}
                </button>
                <p className='text-xs p-4 pb-0'>* Antes de confirmar, revisa que la interpretación sea correcta. Puedes ajustar manualmente en esta interfaz.</p>
                {formVisible && (
                    <div className="mt-4 p-4 border rounded bg-gray-50">
                        <h2 className="text-lg mb-2">Agregar Nuevo Producto</h2>
                        <input
                            type="text"
                            name="nombre_producto"
                            placeholder="Nombre del producto"
                            value={nuevoProducto.nombre_producto}
                            onChange={handleNuevoProductoChange}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <input
                            type="number"
                            name="cantidad"
                            placeholder="Cantidad"
                            value={nuevoProducto.cantidad}
                            onChange={handleNuevoProductoChange}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <input
                            type="text"
                            name="unidad"
                            placeholder="Unidad (g, l, etc.)"
                            value={nuevoProducto.unidad}
                            onChange={handleNuevoProductoChange}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <input
                            type="number"
                            name="precio"
                            placeholder="Precio"
                            value={nuevoProducto.precio}
                            onChange={handleNuevoProductoChange}
                            className="border p-2 rounded w-full mb-2"
                        />
                        <select
                            name="proveedor_id"
                            value={nuevoProducto.proveedor_id}
                            onChange={handleNuevoProductoChange}
                            className="border p-2 rounded w-full mb-2"
                        >
                            <option value="" disabled>Proveedor</option>
                            {proveedores.map((proveedor) => (
                                <option key={proveedor.id} value={proveedor.id}>
                                    {proveedor.nombre}
                                </option>
                            ))}
                        </select>
                        <button
                            className="w-full mt-2 p-2 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={agregarNuevoProducto}
                        >
                            Agregar Producto
                        </button>
                    </div>
                )}

                {/* Botón de Confirmación */}
                <button
                    className="w-full mt-5 p-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={confirmarCompra}
                >
                    Confirmar Compra
                </button>
            </div>
        </div>
    );
};

export default ListaConfirmada;
