USE abarrotes;

-- Insert dummy data into proveedores table
INSERT INTO proveedores (nombre, telefono, periodo, ultima_fecha)
VALUES 
('Proveedor A', '1234567890', 'diario', '2023-01-01'),
('Proveedor B', '0987654321', 'semanal', '2023-01-07'),
('Proveedor C', '1122334455', 'mensual', '2023-01-15');

-- Insert dummy data into productos table
INSERT INTO productos (nombre_producto, cantidad, gramos_por_unidad, precio, proveedor_id)
VALUES 
('Manzana', 5, 100, 0.5, 1), -- 5 manzanas, each 100 grams, provided by Proveedor A
('Saco de croquetas', 1, 10000, 20.0, 2), -- 1 sack of croquettes, 10000 grams, provided by Proveedor B
('Leche', 10, 1000, 1.2, 1), -- 10 liters of milk, each 1000 grams, provided by Proveedor A
('Pan', 20, 50, 0.3, 3), -- 20 pieces of bread, each 50 grams, provided by Proveedor C
('Arroz', 2, 5000, 10.0, 2); -- 2 bags of rice, each 5000 grams, provided by Proveedor B

-- Insert dummy data into ventas table
INSERT INTO ventas (id_producto, cantidad, fecha)
VALUES 
(1, 2, '2023-01-10'), -- Sold 2 Manzanas on 2023-01-10
(2, 1, '2023-01-11'), -- Sold 1 Saco de croquetas on 2023-01-11
(3, 5, '2023-01-12'), -- Sold 5 Leche on 2023-01-12
(4, 10, '2023-01-13'), -- Sold 10 Pan on 2023-01-13
(5, 1, '2023-01-14'); -- Sold 1 Arroz on 2023-01-14