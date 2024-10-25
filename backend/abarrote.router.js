import express from 'express';
import * as abarroteController from './pronos.controller.js';

const router = express.Router();

router.get("/inventario", abarroteController.getInventario);
router.get("/productos", abarroteController.getProductos);

router.put("/inventario/", abarroteController.putInventario);
router.delete("/productos/:id", abarroteController.deleteProductos);

router.post("/productos", abarroteController.postProductos);


router.get("/query", abarroteController.query);



// get, delete,

export default router;