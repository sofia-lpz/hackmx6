import * as abarroteService from './abarrote.service.js';

export const getInventario = async (req, res) => {
    try {
        const inventario = await abarroteService.getInventario();
        res.json(inventario);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProductos = async (req, res) => {
    try {
        const productos = await abarroteService.getProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const putInventario = async (req, res) => {
    try {
        const inventario = await abarroteService.putInventario(req.body);
        res.json(inventario);
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

export const query = async (req, res) => {
    try {
        const query = await abarroteService.query(req.query);
        res.json(query);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}