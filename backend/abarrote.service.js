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
    const connection = await connectToDB();
    const [rows] = await connection.execute("SELECT * FROM productos");
    return rows;
}

export async function putProductos(producto) {
    const connection = await connectToDB();
    const [rows] = await connection.execute(
        "UPDATE productos SET nombre = ?, precio = ? WHERE id = ?",
        [producto.nombre, producto.precio, producto.id]
    );
    return rows;
}

export async function deleteProductos(id) {
    const connection = await connectToDB();
    const [rows] = await connection.execute("DELETE FROM productos WHERE id = ?", [id]);
    return rows;
}

export async function postProductos(producto) {
    const connection = await connectToDB();
    const [rows] = await connection.execute(
        "INSERT INTO productos (nombre, precio) VALUES (?, ?)",
        [producto.nombre, producto.precio]
    );
    return rows;
}

