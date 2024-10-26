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



// get, delete,

export{ router};