import * as abarroteService from './abarrote.service.js';

//productos
export const getProductos = async (req, res) => {
    try {
        const productos = await abarroteService.getProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
export const getProductoById = async (req, res) => {
    try {
        const productos = await abarroteService.getProductoById(req.params.id);
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const putProductos = async (req, res) => {
    try {
        const productos = await abarroteService.putProductos(req.params.id, req.body);
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const deleteProductos = async (req, res) => {
    try {
        const productos = await abarroteService.deleteProductos(req.params.id);
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const postProductos = async (req, res) => {
    try {
        const productos = await abarroteService.postProductos(req.body);
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

//ventas
export const getVentas = async (req, res) => {
    try {
        const ventas = await abarroteService.getVentas();
        res.json(ventas);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const deleteVentas = async (req, res) => {
    try {
        const ventas = await abarroteService.deleteVentas(req.params.id);
        res.json(ventas);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const putVentas = async (req, res) => {
    try {
        const ventas = await abarroteService.putVentas(req.params.id, req.body);
        res.json(ventas);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const postVentas = async (req, res) => {
    try {
        const ventas = await abarroteService.postVentas(req.body);
        res.json(ventas);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getVentaById = async (req, res) => {
    try {
        const ventas = await abarroteService.getVentaById(req.params.id);
        res.json(ventas);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

//proveedores
export const getProveedores = async (req, res) => {
    try {
        const proveedores = await abarroteService.getProveedores();
        res.json(proveedores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const deleteProveedores = async (req, res) => {
    try {
        const proveedores = await abarroteService.deleteProveedores(req.params.id);
        res.json(proveedores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const putProveedores = async (req, res) => {
    try {
        const proveedores = await abarroteService.putProveedores(req.params.id, req.body);
        res.json(proveedores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const postProveedores = async (req, res) => {
    try {
        const proveedores = await abarroteService.postProveedores(req.body);
        res.json(proveedores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProveedorById = async (req, res) => {
    try {
        const proveedores = await abarroteService.getProveedorById(req.params.id);
        res.json(proveedores);
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}


