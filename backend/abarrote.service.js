import mysql from "mysql2/promise";

async function connectToDB() {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
    });
}

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

export async function query(query) {
    let connection;
    try {
        connection = await connectToDB();
        const [rows] = await connection.execute(query);
        return rows;
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

