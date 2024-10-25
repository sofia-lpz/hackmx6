DROP DATABASE IF EXISTS abarrotes;
CREATE DATABASE IF NOT EXISTS abarrotes;

USE abarrotes;

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(255),
    measure_type VARCHAR(50),
    cantidad_producto INT
);

CREATE TABLE conversiones (
    id_conversion INT AUTO_INCREMENT PRIMARY KEY,
    unidad_origen VARCHAR(50),
    unidad_destino VARCHAR(50),
    factor_conversion DECIMAL(10, 6)
);

DELIMITER //

CREATE TRIGGER equivalencia
BEFORE INSERT ON productos
FOR EACH ROW
BEGIN
    DECLARE factor DECIMAL(10, 6) DEFAULT 1;
    DECLARE unidad_destino VARCHAR(50);

    IF NEW.measure_type = 'kg' THEN
        SET unidad_destino = 'g';
    ELSEIF NEW.measure_type = 'l' THEN
        SET unidad_destino = 'ml';
    ELSE
        SET unidad_destino = NEW.measure_type;
    END IF;

    SELECT factor_conversion INTO factor
    FROM conversiones
    WHERE unidad_origen = NEW.measure_type AND unidad_destino = unidad_destino;

    SET NEW.cantidad_producto = NEW.cantidad_producto * factor;

    SET NEW.measure_type = unidad_destino;
END;

//
DELIMITER ;

CREATE VIEW vista_inventario AS
SELECT 
    p.id_producto,
    p.nombre_producto,
    p.measure_type AS unidad_original,
    c.unidad_destino,
	(p.cantidad_producto * c.factor_conversion) AS cantidad_convertida
FROM productos p
JOIN conversiones c ON p.measure_type = c.unidad_origen;



