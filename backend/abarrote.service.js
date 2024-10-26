import mysql from "mysql2/promise";

async function connectToDB() {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
    });
}

//productos
export async function getProductos() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM productos");
        return rows;
    }
    catch (error) {
        throw error;
    }
}

export async function getProductoById(id) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM productos WHERE id = ?", [id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function venderProducto(id, g, cantidad) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM productos WHERE id = ?", [id]);
        const producto = rows[0];

        if (producto.cantidad < cantidad) {
            throw new Error("No hay suficiente cantidad de producto");
        }
        producto.cantidad -= cantidad;
        await connection.execute("UPDATE productos SET cantidad = ? WHERE id = ?", [producto.cantidad, id]);
        await connection.execute("INSERT INTO ventas (id_producto, cantidad, fecha) VALUES (?, ?, NOW())", [id, cantidad]);

        return producto;
    } catch (error) {
        throw error;
    }
}

export async function agregarProductos(id, g, cantidad) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM productos WHERE id = ?", [id]);
        const producto = rows[0];

        if (producto.cantidad < cantidad) {
            throw new Error("No hay suficiente cantidad de producto");
        }
        producto.cantidad += cantidad;
        await connection.execute("UPDATE productos SET cantidad = ? WHERE id = ?", [producto.cantidad, id]);
        await connection.execute("INSERT INTO ventas (id_producto, cantidad, fecha) VALUES (?, ?, NOW())", [id, cantidad]);

        return producto;
    } catch (error) {
        throw error;
    }
}

export async function putProductos(id, producto) {
    try {
        const conn = await connectToDB();
        const keys = Object.keys(producto);
        const values = Object.values(producto);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        values.push(id);
        const query = `UPDATE productos SET ${setClause} WHERE id = ?`;

        await conn.execute(query, values);

        const [updatedRow] = await conn.execute("SELECT * FROM productos WHERE id = ?", [id]);
        conn.end();
        return updatedRow[0];
    } catch (error) {
        throw error;
    }
}

export async function deleteProductos(id) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("DELETE FROM productos WHERE id = ?", [id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function postProductos(producto) {
    try {
        const connection = await connectToDB();
        const keys = Object.keys(producto);
        const values = Object.values(producto);

        // Ensure that proveedor_id is correctly set if proveedor_nombre is provided
        if (keys.includes('proveedor_nombre')) {
            const proveedor = await getProveedorByNombre(producto.proveedor_nombre);
            if (proveedor.length > 0) {
                values.push(proveedor[0].id);
                keys.push('proveedor_id');
            } else {
                throw new Error("Proveedor no encontrado");
            }

            const index = keys.indexOf('proveedor_nombre');
            if (index > -1) {
                keys.splice(index, 1);
                values.splice(index, 1);
            }
        }

        const query = `INSERT INTO productos (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;
        await connection.execute(query, values);
        connection.end();
        return producto;
    } catch (error) {
        console.error('Error in postProductos:', error);
        throw error;
    }
}

//ventas
export async function getVentas() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM ventas");
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function deleteVentas(id) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("DELETE FROM ventas WHERE id = ?", [id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function putVentas(id, venta) {
    try {
        const conn = await connectToDB();
        const keys = Object.keys(venta);
        const values = Object.values(venta);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        values.push(id);
        const query = `UPDATE ventas SET ${setClause} WHERE id = ?`;

        await conn.execute(query, values);

        const [updatedRow] = await conn.execute("SELECT * FROM ventas WHERE id = ?", [id]);
        conn.end();
        return updatedRow[0];
    } catch (error) {
        throw error;
    }
}

export async function postVentas(venta) {
    try {
        const connection = await connectToDB();
        const keys = Object.keys(venta);
        const values = Object.values(venta);
        let producto = null;

        // Ensure that producto_id is correctly set if nombre_producto is provided
        if (keys.includes('nombre_producto')) {
            const productos = await getProductoByNombre(venta.nombre_producto);
            if (productos.length > 0) {
                producto = productos[0];
                values.push(producto.id);
                keys.push('id_producto');
            } else {
                throw new Error("Producto no encontrado");
            }

            // Remove nombre_producto from keys and values
            const index = keys.indexOf('nombre_producto');
            if (index > -1) {
                keys.splice(index, 1);
                values.splice(index, 1);
            }
        }

        // Check if the product quantity is sufficient
        const [productRows] = await connection.execute("SELECT cantidad FROM productos WHERE id = ?", [producto.id]);
        const product = productRows[0];
        if (product.cantidad < venta.cantidad) {
            throw new Error("No hay suficiente cantidad de producto");
        }

        // Insert the sale into the ventas table
        const query = `INSERT INTO ventas (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;
        await connection.execute(query, values);

        // Update the product quantity
        const newQuantity = product.cantidad - venta.cantidad;
        await connection.execute("UPDATE productos SET cantidad = ? WHERE id = ?", [newQuantity, producto.id]);

        connection.end();
        return venta; // Return the venta object instead of producto
    } catch (error) {
        console.error('Error in postVentas:', error);
        throw error;
    }
}

export async function getVentaById(id) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM ventas WHERE id = ?", [id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

//proveedores

export async function getProveedorByNombre(nombre) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM proveedores WHERE nombre = ?", [nombre]);
        return rows;
    } catch (error) {
        console.error('Error in getProveedorByNombre:', error);
        throw error;
    }
}

export async function getProductoByNombre(nombre) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM productos WHERE nombre_producto = ?", [nombre]);
        return rows;
    } catch (error) {
        console.error('Error in getProductoByNombre:', error);
        throw error;
    }
}

export async function getProveedores() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM proveedores");
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function deleteProveedores(id) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("DELETE FROM proveedores WHERE id = ?", [id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function putProveedores(id, proveedor) {
    try {
        const conn = await connectToDB();
        const keys = Object.keys(proveedor);
        const values = Object.values(proveedor);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        values.push(id);
        const query = `UPDATE proveedores SET ${setClause} WHERE id = ?`;

        await conn.execute(query, values);

        const [updatedRow] = await conn.execute("SELECT * FROM proveedores WHERE id = ?", [id]);
        conn.end();
        return updatedRow[0];
    } catch (error) {
        throw error;
    }
}

export async function postProveedores(proveedor) {
    try {
        const connection = await connectToDB();
        const keys = Object.keys(proveedor);
        const values = Object.values(proveedor);
        const query = `INSERT INTO proveedores (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;

        await connection.execute(query, values);
        connection.end();
        return proveedor;
    } catch (error) {
        throw error;
    }
}

export async function getProveedorById(id) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM proveedores WHERE id = ?", [id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Ventas por cantidad
export async function getProductosVentasMasBajas() {
    try {
        console.log('Intentando conectar a la base de datos...');
        const connection = await connectToDB();
        console.log('Conectado a la base de datos:', connection);
        console.log('connection');
        const [rows] = await connection.execute(`
            SELECT p.nombre_producto, SUM(v.cantidad) AS total_ventas
            FROM productos p
            JOIN ventas v ON p.id = v.id_producto
            GROUP BY p.id
            ORDER BY total_ventas ASC
            LIMIT 1;
        `);
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Error en la ejecución:', error.message);
        throw error;
    }
}

export async function getProductosVentasMasAltas() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT p.nombre_producto, SUM(v.cantidad) AS total_ventas
            FROM productos p
            JOIN ventas v ON p.id = v.id_producto
            GROUP BY p.id
            ORDER BY total_ventas DESC
            LIMIT 1;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Ventas por precio
// Los campos del QUERY de la estan harcoded
export async function getProductosVentasFiltradasFecha() {
     try {
        const connection = await connectToDB();

        const [dates] = await connection.execute(`
            SELECT MIN(fecha) AS startDate, MAX(fecha) AS endDate FROM ventas;
        `);
        const { startDate, endDate } = dates[0];

        const [rows] = await connection.execute(`
            SELECT p.nombre_producto, SUM(v.cantidad * p.precio) AS total_ventas
            FROM productos p
            JOIN ventas v ON p.id = v.id_producto
            WHERE v.fecha BETWEEN ? AND ?
            GROUP BY p.id
            ORDER BY total_ventas DESC;
        `, [startDate, endDate]);
        return rows;
     } catch (error) {
         throw error;
     }
 }

export async function getProductosDiasMasVentas() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT DAYNAME(v.fecha) AS dia_semana, COUNT(*) AS total_ventas
            FROM ventas v
            GROUP BY dia_semana
            ORDER BY total_ventas DESC
            LIMIT 1;
        `,);
        return rows;
    } catch (error) {
        throw error;
    }
}


// export async function getProductosSinVentasFiltradasFecha() {
//     try {
//         const connection = await connectToDB();

//         const [dates] = await connection.execute(`
//             SELECT MIN(fecha) AS startDate, MAX(fecha) AS endDate FROM ventas;
//         `);
//         const { startDate, endDate } = dates[0];

//         const [rows] = await connection.execute(`
//             SELECT p.nombre_producto
//             FROM productos p
//             WHERE NOT EXISTS (
//                 SELECT 1 FROM ventas v WHERE p.id = v.id_producto AND v.fecha BETWEEN ? AND ?
//             );
//         `, [startDate, endDate]);
//         return rows;
//     } catch (error) {
//         throw error;
//     }
// }

// De stock

export async function getProductosStockProximoAAcabarse() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT nombre_producto, cantidad
            FROM productos
            WHERE cantidad < 5;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getProductosStockAgotado() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT nombre_producto
            FROM productos
            WHERE cantidad = 0;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Precios

export async function getProductosPrecioMasBajo() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT nombre_producto, precio
            FROM productos
            ORDER BY precio ASC
            LIMIT 1;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getProductosPrecioMasAlto() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT nombre_producto, precio
            FROM productos
            ORDER BY precio DESC
            LIMIT 1;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// * IDEA - El filtrado por precio se tendria que aplicar 2 endpoints en donde requiera del precio bajo y alto
// export async function getProductosPrecioFiltrado() {
//     try {
//         const connection = await connectToDB();
//         const [rows] = await connection.execute(`
            
//         `);
//         return rows;
//     } catch (error) {
//         throw error;
//     }
// }

export async function getProductosPrecioTotalInventario() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT SUM(precio * cantidad) AS total_valor_inventario
            FROM productos;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getProductosTodaviaHay(nombre) {
    try {
        const connection = await connectToDB();

        const [rows] = await connection.execute(`
            SELECT IF(cantidad > 0, 1, 0) AS todavia_hay
            FROM productos
            WHERE nombre_producto = ?;
        `, [nombre]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getProductosCuantoQueda(nombre) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT cantidad
            FROM productos
            WHERE nombre_producto = ?;
        `, [nombre]);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Proveedores
// Ver como pasar las fechas
export async function getProveedoresMasProximo() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT *
            FROM proveedores
            WHERE ultima_fecha = DATE(?)
            ORDER BY ultima_fecha DESC
            LIMIT 1;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Modificar QUERY para que tambien sea por 0
export async function getProveedoresSiPaso(nombre) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT 1 AS paso
            FROM proveedores
            WHERE nombre = ? AND pasaron_ultima_fecha = TRUE;
        `, [nombre]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getProveedoresProductos(nombre) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT p.nombre_producto, p.cantidad
            FROM productos p
            JOIN proveedores pr ON p.proveedor_id = pr.id
            WHERE pr.nombre = ?;
        `, [nombre]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getProveedoresNoPasaron() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT *
            FROM proveedores
            WHERE pasaron_ultima_fecha = FALSE;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Sincronizar las fechas para que utilize tiempos reales
export async function getProveedoresEsteMes() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT *
            FROM proveedores
            WHERE periodo = 'mensual'
            AND ultima_fecha BETWEEN CURDATE() AND LAST_DAY(CURDATE());
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Igual que el anterior
export async function getProveedoresEstaSemana() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT *
            FROM proveedores
            WHERE periodo = 'semanal'
            AND YEARWEEK(ultima_fecha, 1) = YEARWEEK(CURDATE(), 1);
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Igual que el anterior
export async function getProveedoresEsteDia() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT *
            FROM proveedores
            WHERE periodo = 'diario'
            AND DATE(ultima_fecha) = CURDATE();
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Preguntas

export async function getPreguntasStockSemana() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT nombre_producto, cantidad
            FROM productos
            WHERE cantidad < 10;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getPreguntasStockMes() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT nombre_producto, cantidad
            FROM productos
            WHERE cantidad < 30;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}