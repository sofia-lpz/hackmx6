DROP DATABASE IF EXISTS abarrotes;
CREATE DATABASE IF NOT EXISTS abarrotes;

USE abarrotes;

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    tipo_producto VARCHAR(255)
);

CREATE TABLE unidades_de_medida (
    id_unidad INT AUTO_INCREMENT PRIMARY KEY,
    measure INT,
    measure_type VARCHAR(50)
);

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT,
    nombre_producto VARCHAR(255),
    tipo_producto VARCHAR(255),
    measure VARCHAR(50),
    cantidad_producto INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
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
    DECLARE factor DECIMAL(10, 6);
    DECLARE unidad_destino VARCHAR(50);

    SELECT measure INTO unidad_destino FROM unidades_de_medida WHERE id_unidad = NEW.id_unidad;

    IF NEW.measure != unidad_destino THEN
        SELECT factor_conversion INTO factor
        FROM conversiones
        WHERE unidad_origen = NEW.measure AND unidad_destino = unidad_destino;
        
        SET NEW.cantidad_producto = NEW.cantidad_producto * factor;
        
        SET NEW.measure = unidad_destino;
    END IF;
END;
//

DELIMITER ;




