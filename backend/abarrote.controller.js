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

export const venderProducto = async (req, res) => {
    try {
        const productos = await abarroteService.venderProducto(req.params.id, req.params.g, req.params.cantidad);
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const agregarProductos = async (req, res) => {
    try {
        const productos = await abarroteService.agregarProductos(req.params.id, req.params.g, req.params.cantidad);
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
        const existingProducto = await abarroteService.getProductosTodaviaHay(req.body.nombre_producto);
        if (existingProducto && existingProducto.length > 0) {
            return res.status(409).send({ message: "Producto con el mismo nombre ya existe." });
        }
        const productos = await abarroteService.postProductos(req.body);
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProveedorByNombre = async (req, res) => {
    try {
        const proveedor = await abarroteService.getProveedorByNombre(req.params.nombre);
        res.json(proveedor);
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



//extra endpoints:

//ventas por cantidad


export const getProductosVentasMasBajas = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosVentasMasBajas();
        if (!productos || productos.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos con ventas bajas." });
        }
        res.json(productos);
    } catch (error) {
        console.error('Error fetching lowest sales products:', error);
        res.status(500).send({ message: "Error al recuperar los productos con ventas más bajas" });
    }
}

export const getProductosVentasMasAltas = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosVentasMasAltas();
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

//ventas por precio

export const getProductosVentasFiltradasFecha = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosVentasFiltradasFecha();
        res.json(productos);
    } catch (error) {
        console.error('Error en getProductosVentasFiltradasFecha:', error);
        res.status(500).send({ message: "Error al recuperar los productos con ventas filtradas por fecha." });
    }
}


export const getProductosDiasMasVentas = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosDiasMasVentas();
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProductosSinVentasFiltradasFecha = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosSinVentasFiltradasFecha();
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

//de stock
export const getProductosStockProximoAAcabarse = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosStockProximoAAcabarse();
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProductosStockAgotado = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosStockAgotado();
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

//precios
export const getProductosPrecioMasBajo = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosPrecioMasBajo();
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProductosPrecioMasAlto = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosPrecioMasAlto();
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProductosPrecioFiltrado = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosPrecioFiltrado();
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProductosPrecioTotalInventario = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosPrecioTotalInventario();
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProductosTodaviaHay = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosTodaviaHay(req.params.nombre);
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProductosCuantoQueda = async (req, res) => {
    try {
        const productos = await abarroteService.getProductosCuantoQueda(req.params.nombre);
        res.json(productos);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

//proveedores
export const getProveedoresMasProximo = async (req, res) => {
    try {
        const proveedores = await abarroteService.getProveedoresMasProximo();
        res.json(proveedores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProveedoresSiPaso = async (req, res) => {
    try {
        const proveedores = await abarroteService.getProveedoresSiPaso(req.params.nombre);
        res.json(proveedores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProveedoresProductos = async (req, res) => {
    try {
        const proveedores = await abarroteService.getProveedoresProductos(req.params.nombre);
        res.json(proveedores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProveedoresNoPasaron = async (req, res) => {
    try {
        const proveedores = await abarroteService.getProveedoresNoPasaron();
        res.json(proveedores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProveedoresEsteMes = async (req, res) => {
    try {
        const proveedores = await abarroteService.getProveedoresEsteMes();
        res.json(proveedores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProveedoresEstaSemana = async (req, res) => {
    try {
        const proveedores = await abarroteService.getProveedoresEstaSemana();
        res.json(proveedores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getProveedoresEsteDia = async (req, res) => {
    try {
        const proveedores = await abarroteService.getProveedoresEsteDia();
        res.json(proveedores);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

//preguntas

export const getPreguntasStockSemana = async (req, res) => {
    try {
        const preguntas = await abarroteService.getPreguntasStockSemana();
        res.json(preguntas);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const getPreguntasStockMes = async (req, res) => {
    try {
        const preguntas = await abarroteService.getPreguntasStockMes();
        res.json(preguntas);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}