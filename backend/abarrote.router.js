import express from 'express';
import * as abarroteController from './abarrote.controller.js';

const router = express.Router();

router.get("/productos", abarroteController.getProductos);
//check

router.get("/productos/:id", abarroteController.getProductoById);
//check

router.put("/productos/:id", abarroteController.putProductos);
//no

router.delete("/productos/:id", abarroteController.deleteProductos);
//check

router.post("/productos", abarroteController.postProductos);
//check

router.get("/query", abarroteController.query);
//no


router.get("/ventas", abarroteController.getVentas);
router.delete("/ventas/:id", abarroteController.deleteVentas);
router.put("/ventas/:id", abarroteController.putVentas);
router.post("/ventas", abarroteController.postVentas);
router.get("/ventas/:id", abarroteController.getVentaById);

router.get("/proveedores", abarroteController.getProveedores);
router.delete("/proveedores/:id", abarroteController.deleteProveedores);
router.put("/proveedores/:id", abarroteController.putProveedores);
router.post("/proveedores", abarroteController.postProveedores);
router.get("/proveedores/:id", abarroteController.getProveedorById);



// get, delete,

export{ router};