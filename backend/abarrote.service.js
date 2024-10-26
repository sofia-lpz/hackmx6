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

/*
//ventas por cantidad
export async function getProductosVentasMasBajas() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM productos ORDER BY ventas ASC LIMIT 3");
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getProductosVentasMasAltas() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM productos ORDER BY ventas DESC LIMIT 3");
        return rows;
    } catch (error) {
        throw error;
    }
}

//ventas por precio
export async function getProductosVentasFiltradasFecha(fecha) {
    //TODO
}

export async function getProductosDiasMasVentas() {
    try {
        const connection = await connectToDB();
        const [rows] = await connection.execute("SELECT * FROM productos ORDER BY dias_mas_ventas DESC LIMIT 3");
        return rows;
    }
*/

