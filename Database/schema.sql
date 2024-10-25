DROP DATABASE IF EXISTS abarrotes;
CREATE DATABASE IF NOT EXISTS abarrotes;
USE abarrotes;

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    gramos_por_unidad FLOAT,
    cantidad_gramos FLOAT,
    cantidad_kilogramos FLOAT
);

DELIMITER //

CREATE TRIGGER equivalencia
BEFORE INSERT ON productos
FOR EACH ROW
BEGIN
    IF NEW.gramos_por_unidad IS NOT NULL THEN
        SET NEW.cantidad_gramos = NEW.cantidad * NEW.gramos_por_unidad;
        SET NEW.cantidad_kilogramos = NEW.cantidad_gramos / 1000;
    END IF;
END//

CREATE TRIGGER equivalencia_update
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
    IF NEW.gramos_por_unidad IS NOT NULL THEN
        SET NEW.cantidad_gramos = NEW.cantidad * NEW.gramos_por_unidad;
        SET NEW.cantidad_kilogramos = NEW.cantidad_gramos / 1000;
    END IF;
END//

CREATE TRIGGER cantidad_update
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
    IF NEW.cantidad != OLD.cantidad THEN
        IF NEW.gramos_por_unidad IS NOT NULL THEN
            SET NEW.cantidad_gramos = NEW.cantidad * NEW.gramos_por_unidad;
            SET NEW.cantidad_kilogramos = NEW.cantidad_gramos / 1000;
        END IF;
    END IF;
END//

DELIMITER ;