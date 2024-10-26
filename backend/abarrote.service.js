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
        const query = `INSERT INTO productos (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;

        await connection.execute(query, values);
        connection.end();
        return producto;
    } catch (error) {
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
        const query = `INSERT INTO ventas (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;

        await connection.execute(query, values);
        connection.end();
        return venta;
    } catch (error) {
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

//extra endpoints:

//ventas por cantidad
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

export async function getProductosVentasFiltradasFecha(startDate, endDate) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT p.nombre_producto, SUM(v.cantidad * p.precio) AS total_ventas
            FROM productos p
            JOIN ventas v ON p.id = v.id_producto
            WHERE v.fecha BETWEEN '?' AND '?'
            GROUP BY p.id
            ORDER BY total_ventas DESC;
        `, [startDate, endDate]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getProductosSinVentasFiltradasFecha(startDate, endDate) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT p.nombre_producto
            FROM productos p
            WHERE NOT EXISTS (
                SELECT 1 FROM ventas v WHERE p.id = v.id_producto AND v.fecha BETWEEN ? AND ?
            );
        `, [startDate, endDate]);
        return rows;
    } catch (error) {
        throw error;
    }
}

// De stock

export async function getProductosStockProximoAAcabarse() {
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

// Proveedores

export async function getProveedoresMasProximo() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT nombre
            FROM proveedores
            WHERE ultima_fecha = (
                SELECT MAX(ultima_fecha) FROM proveedores
            );
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getProveedoresProductos(providerName) {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute(`
            SELECT pr.nombre, p.nombre_producto
            FROM proveedores pr
            JOIN productos p ON pr.id = p.proveedor_id
            WHERE pr.nombre = ?;
        `, [providerName]);
        return rows;
    } catch (error) {
        throw error;
    }
}

