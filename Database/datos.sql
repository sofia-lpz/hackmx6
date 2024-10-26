USE abarrotes;

-- Insert dummy data into proveedores table
INSERT INTO proveedores (nombre, telefono, periodo, ultima_fecha, pasaron_ultima_fecha)
VALUES 
('gamesa', '1234567890', 'diario', '2023-01-01', 1),
('bimbo', '0987654321', 'semanal', '2023-01-07', 0),
('danone', '1122334455', 'mensual', '2023-01-15', 0),
('pepsico', '6677889900', 'diario', '2023-01-01', 1);

-- Insert dummy data into productos table
INSERT INTO productos (nombre_producto, cantidad, unidad, precio, proveedor_id)
VALUES 
('Manzana', 5, 'g', 0.5, 1), -- 5 manzanas, each in grams, provided by Proveedor A
('Croquetas', 1, 'g', 20.0, 2), -- 1 sack of croquettes, in grams, provided by Proveedor B
('Leche', 10, 'l', 1.2, 1), -- 10 liters of milk, provided by Proveedor A
('Pan', 20, 'g', 0.3, 3), -- 20 pieces of bread, each in grams, provided by Proveedor C
('Arroz', 2, 'g', 10.0, 2); -- 2 bags of rice, each in grams, provided by Proveedor B

-- Insert dummy data into ventas table
INSERT INTO ventas (id_producto, cantidad, fecha)
VALUES 
(1, 2, '2023-01-10'), -- Sold 2 Manzanas on 2023-01-10
(2, 1, '2023-01-11'), -- Sold 1 Saco de croquetas on 2023-01-11
(3, 5, '2023-01-12'), -- Sold 5 Leche on 2023-01-12
(4, 10, '2023-01-13'), -- Sold 10 Pan on 2023-01-13
(5, 1, '2023-01-14'); -- Sold 1 Arroz on 2023-01-14