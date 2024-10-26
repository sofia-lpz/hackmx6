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

//extra endpoints:


//ventas por cantidad
router.get("/productos/ventas_mas_bajas", abarroteController.getProductosVentasMasBajas);//regresa el producto con menos ventas
router.get("/productos/ventas_mas_altas", abarroteController.getProductosVentasMasAltas);//regresa el producto con mas ventas

//ventas por precio
router.get("/productos/ventas_filtradas_fecha", abarroteController.getProductosVentasFiltradasFecha);//todavia no
router.get("/productos/dias_de_la_semana_mas_ventas", abarroteController.getProductosDiasMasVentas);//regresa el dia de la semana con mas ventas
router.get("/productos/sin_ventas_filtradas_fecha", abarroteController.getProductosSinVentasFiltradasFecha);//todavia no

//de stock
router.get("/productos/stock_proximo_a_acabarse", abarroteController.getProductosStockProximoAAcabarse);
router.get("/productos/stock_agotado", abarroteController.getProductosStockAgotado);

//precios
router.get("/productos/precio_mas_bajo", abarroteController.getProductosPrecioMasBajo);
router.get("/productos/precio_mas_alto", abarroteController.getProductosPrecioMasAlto);
router.get("/productos/precio_filtrado", abarroteController.getProductosPrecioFiltrado);

router.get("/productos/precio_total_inventario", abarroteController.getProductosPrecioTotalInventario);
router.get("/productos/todavia_hay/:nombre", abarroteController.getProductosTodaviaHay);
router.get("/productos/cuanto_queda/:nombre", abarroteController.getProductosCuantoQueda);

//proveedores
router.get("/proveedores/mas_proximo", abarroteController.getProveedoresMasProximo);
router.get("/proveedores/sipaso/:nombre", abarroteController.getProveedoresSiPaso);
router.get("/proveedores/productos/:nombre", abarroteController.getProveedoresProductos);
router.get("/proveedores/no_pasaron", abarroteController.getProveedoresNoPasaron);
router.get("/proveedores/este_mes", abarroteController.getProveedoresEsteMes);
router.get("/proveedores/esta_semana", abarroteController.getProveedoresEstaSemana);
router.get("/proveedores/este_dia", abarroteController.getProveedoresEsteDia);

//preguntas
router.get("/preguntas/esta_semana", abarroteController.getPreguntasStockSemana); //que tengo que comprar esta semana?
router.get("/preguntas/este_mes", abarroteController.getPreguntasStockMes); //que tengo que comprar este mes?


export{ router};