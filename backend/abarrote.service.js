import mysql from "mysql2/promise";

async function connectToDB() {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
    });
}

export async function getInventario() {
    const connection = await connectToDB();
    const [rows] = await connection.execute("SELECT * FROM inventario");
    return rows;
}

export async function getProductos() {
    const connection = await connectToDB();
    const [rows] = await connection.execute("SELECT * FROM productos");
    return rows;
}

export async function putInventario(inventario) {
    const connection = await connectToDB();
    const [rows] = await connection.execute("UPDATE inventario SET ? WHERE id = ?", [inventario, inventario.id]);
    return rows;
}

export async function deleteProductos(id) {
    const connection = await connectToDB();
    const [rows] = await connection.execute("DELETE FROM productos WHERE id = ?", [id]);
    return rows;
}

export async function postProductos(producto) {
    const connection = await connectToDB();
    const [rows] = await connection.execute("INSERT INTO productos SET ?", producto);
    return rows;
}

export async function query(query) {
    const connection = await connectToDB();
    const [rows] = await connection.execute(query);
    return rows;
}

