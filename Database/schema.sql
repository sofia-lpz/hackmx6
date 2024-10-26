DROP DATABASE IF EXISTS abarrotes;
CREATE DATABASE IF NOT EXISTS abarrotes;
USE abarrotes;

CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) DEFAULT 'Sin registro',
    telefono VARCHAR(255) DEFAULT 'Sin registro',
    periodo ENUM('diario', 'semanal', 'mensual') DEFAULT 'diario',
    ultima_fecha DATE DEFAULT '2023-01-01',
    pasaron_ultima_fecha BOOLEAN DEFAULT 0
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(255) NOT NULL DEFAULT 'Sin registro',
    cantidad INT DEFAULT 0,
    unidad VARCHAR(255) DEFAULT 'Sin registro',
    precio FLOAT DEFAULT 0.0,
    proveedor_id INT,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE
);

CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    cantidad INT DEFAULT 0,
    fecha DATE DEFAULT '2023-01-01',
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
);

DELIMITER //
CREATE TRIGGER on_venta
AFTER INSERT ON ventas
FOR EACH ROW
BEGIN
    UPDATE productos
    SET cantidad = cantidad - NEW.cantidad
    WHERE id = NEW.id_producto;
END;
//

CREATE TRIGGER on_delete_venta
AFTER DELETE ON ventas
FOR EACH ROW
BEGIN
    UPDATE productos
    SET cantidad = cantidad + OLD.cantidad
    WHERE id = OLD.id_producto;
END;
//

DELIMITER ;