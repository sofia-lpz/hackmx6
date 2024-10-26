import React, { useState } from 'react';

const Proveedores = () => {
    const [formData, setFormData] = useState({
        id: 1, // Puedes cambiar esto según tu lógica de ID
        nombre: '',
        telefono: '',
        periodo: '',
        ultima_fecha: '',
        pasaron_ultima_fecha: 1 // Valor por defecto, si es necesario
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifica que todos los campos requeridos no estén vacíos
        if (!formData.nombre || !formData.telefono || !formData.periodo || !formData.ultima_fecha) {
            console.error('Todos los campos son requeridos.');
            return;
        }

        const data = new FormData();
        data.append('id', formData.id);
        data.append('nombre', formData.nombre);
        data.append('telefono', formData.telefono);
        data.append('periodo', formData.periodo);
        data.append('ultima_fecha', formData.ultima_fecha);
        data.append('pasaron_ultima_fecha', formData.pasaron_ultima_fecha);

        try {
            const response = await fetch('http://localhost:8080/api/proveedores', {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                console.log('Proveedor registrado con éxito');
                setIsSubmitted(true);
                // Limpiar el formulario después de enviar
                setFormData({
                    id: formData.id + 1, // Cambia esto si tu lógica de ID es diferente
                    nombre: '',
                    telefono: '',
                    periodo: '',
                    ultima_fecha: '',
                    pasaron_ultima_fecha: 1
                });
            } else {
                console.error('Error al registrar el proveedor');
            }
        } catch (error) {
            console.error('Error en la conexión', error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Registrar Proveedor</h2>
            {isSubmitted && (
                <div className="mb-4 p-4 text-green-700 bg-green-100 rounded">
                    Proveedor registrado con éxito.
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Teléfono:</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Periodo:</label>
                    <select
                        name="periodo"
                        value={formData.periodo}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    >
                        <option value="" disabled>Seleccione un periodo</option>
                        <option value="diario">Diario</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensual">Mensual</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Última Fecha:</label>
                    <input
                        type="datetime-local"
                        name="ultima_fecha"
                        value={formData.ultima_fecha}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">¿Pasaron la última fecha? (1 = Sí, 0 = No):</label>
                    <input
                        type="number"
                        name="pasaron_ultima_fecha"
                        value={formData.pasaron_ultima_fecha}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    Registrar
                </button>
            </form>
        </div>
    );
};

export default Proveedores;
