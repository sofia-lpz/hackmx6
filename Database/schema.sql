DROP DATABASE IF EXISTS abarrotes;
CREATE DATABASE IF NOT EXISTS abarrotes;
USE abarrotes;

CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    telefono VARCHAR(255),
    periodo enum('diario', 'semanal', 'mensual'),
    ultima_fecha DATE,
    pasaron_ultima_fecha BOOLEAN
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(255) NOT NULL,
    cantidad INT,
    unidad VARCHAR(255),
    precio FLOAT,
    proveedor_id INT,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE
);

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    cantidad INT,
    fecha DATE,
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
);
