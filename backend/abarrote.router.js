import express from 'express';
import * as abarroteController from './abarrote.controller.js';

const router = express.Router();

router.get("/productos", abarroteController.getProductos);
//check

router.get("/productos/:id", abarroteController.getProductoById);
//check

router.put("/productos/vender/:id/:cantidad", abarroteController.venderProducto);
router.put("/productos/agregar/:id/cantidad", abarroteController.agregarProductos);

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
router.get("/productos_ventas_mas_bajas", abarroteController.getProductosVentasMasBajas);//regresa el producto con menos ventas
router.get("/productos_ventas_mas_altas", abarroteController.getProductosVentasMasAltas);//regresa el producto con mas ventas

//ventas por precio
router.get("/productos_ventas_filtradas_fecha", abarroteController.getProductosVentasFiltradasFecha);//todavia no
router.get("/productos_dias_de_la_semana_mas_ventas", abarroteController.getProductosDiasMasVentas);//regresa el dia de la semana con mas ventas
router.get("/productos_sin_ventas_filtradas_fecha", abarroteController.getProductosSinVentasFiltradasFecha);//todavia no

//de stock
router.get("/productos_stock_proximo_a_acabarse", abarroteController.getProductosStockProximoAAcabarse);//regresa una lista de los productos que tienen menos de 5 de stock
router.get("/productos_stock_agotado", abarroteController.getProductosStockAgotado);//regresa una lista de ls productos que tienen 0 de stock

//precios
router.get("/productos_precio_mas_bajo", abarroteController.getProductosPrecioMasBajo);//regresa el producto con el precio mas bajo
router.get("/productos_precio_mas_alto", abarroteController.getProductosPrecioMasAlto);//regresa el producto con el precio mas alto
router.get("/productos_precio_filtrado", abarroteController.getProductosPrecioFiltrado);//todavia no

router.get("/productos_precio_total_inventario", abarroteController.getProductosPrecioTotalInventario);//regresa una suma de los precios de todos los productos multiplicados por la cantidad de productos
router.get("/productos_todavia_hay/:nombre", abarroteController.getProductosTodaviaHay);//regresa 1 o 0 si todavia hay de ese producto usando su nombre
router.get("/productos_cuanto_queda/:nombre", abarroteController.getProductosCuantoQueda);//regresa la cantidad de ese producto que queda usando su nombre

//proveedores
router.get("/proveedores_mas_proximo/:fecha_actual", abarroteController.getProveedoresMasProximo);//regresa el proveedor mas proximo a la fecha actual
router.get("/proveedores_sipaso/:nombre", abarroteController.getProveedoresSiPaso);//regresa 1 o 0 si el proveedor ya paso usando su nombre
router.get("/proveedores_productos/:nombre", abarroteController.getProveedoresProductos);//regresa los productos que vende un proveedor usando su nombre
router.get("/proveedores_no_pasaron", abarroteController.getProveedoresNoPasaron);//regresa los proveedores que no pasaron la ultima vez
router.get("/proveedores_este_mes", abarroteController.getProveedoresEsteMes);//regresa los proveedores que van a pasar este mes (checar que sean despues de hoy)
router.get("/proveedores_esta_semana", abarroteController.getProveedoresEstaSemana);//regresa los proveedores que van a pasar esta semana (checar que sean despues de hoy)
router.get("/proveedores_este_dia", abarroteController.getProveedoresEsteDia);//regresa los provedores que van a pasar hoy (sin checar hora)

//preguntas
router.get("/preguntas_esta_semana", abarroteController.getPreguntasStockSemana); //que tengo que comprar esta semana? regresa lista de productos que tengan stock menos de 10
router.get("/preguntas_este_mes", abarroteController.getPreguntasStockMes); //que tengo que comprar este mes? regresa lista de productos que tengan stock menos de 30

export{router};