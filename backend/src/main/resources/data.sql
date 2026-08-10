-- Users (password for all is admin123: $2a$10$pHqvIyM/X9W4aq/XfWfDouhkZBL0TzPT4DPCCmqDp.IJr6a2sUGRm)
INSERT INTO users (username, email, password_hash, full_name, role, active, created_at) VALUES 
('admin', 'admin@cmms.com', '$2a$10$pHqvIyM/X9W4aq/XfWfDouhkZBL0TzPT4DPCCmqDp.IJr6a2sUGRm', 'Carlos Mendoza', 'ADMIN', true, CURRENT_TIMESTAMP),
('supervisor1', 'super1@cmms.com', '$2a$10$pHqvIyM/X9W4aq/XfWfDouhkZBL0TzPT4DPCCmqDp.IJr6a2sUGRm', 'Ana Gómez', 'SUPERVISOR', true, CURRENT_TIMESTAMP),
('tech1', 'tech1@cmms.com', '$2a$10$pHqvIyM/X9W4aq/XfWfDouhkZBL0TzPT4DPCCmqDp.IJr6a2sUGRm', 'Roberto Rojas', 'TECHNICIAN', true, CURRENT_TIMESTAMP),
('tech2', 'tech2@cmms.com', '$2a$10$pHqvIyM/X9W4aq/XfWfDouhkZBL0TzPT4DPCCmqDp.IJr6a2sUGRm', 'Lucía Fernández', 'TECHNICIAN', true, CURRENT_TIMESTAMP),
('tech3', 'tech3@cmms.com', '$2a$10$pHqvIyM/X9W4aq/XfWfDouhkZBL0TzPT4DPCCmqDp.IJr6a2sUGRm', 'Mario Vargas', 'TECHNICIAN', true, CURRENT_TIMESTAMP);

-- Equipment
INSERT INTO equipment (code, name, description, category, status, manufacturer, model, serial_number, installation_date, created_at, updated_at) VALUES 
('EQ-001', 'Motor Principal A', 'Motor trifásico de cinta transportadora', 'MECANICO', 'OPERATIVO', 'Siemens', 'M-3000', 'SN-12345', '2023-01-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EQ-002', 'Panel Eléctrico Central', 'Panel de distribución Nave 1', 'ELECTRICO', 'OPERATIVO', 'Schneider Electric', 'PE-400', 'SN-98765', '2022-11-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EQ-003', 'Compresor de Aire', 'Compresor de aire industrial 50HP', 'NEUMATICO', 'EN_MANTENIMIENTO', 'Atlas Copco', 'GA-37', 'AC-88321', '2021-05-20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EQ-004', 'Bomba Hidráulica', 'Bomba de presión prensa principal', 'HIDRAULICO', 'OPERATIVO', 'Bosch Rexroth', 'A10VSO', 'BR-7412', '2024-02-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EQ-005', 'Torno CNC', 'Torno de control numérico', 'MECANICO', 'FUERA_DE_SERVICIO', 'Haas', 'ST-20', 'HS-9988', '2020-08-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EQ-006', 'Generador Diésel', 'Generador de respaldo 500kVA', 'ELECTRICO', 'OPERATIVO', 'Caterpillar', 'C15', 'CAT-1122', '2019-12-05', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EQ-007', 'Banda Transportadora B', 'Línea de empaque', 'MECANICO', 'OPERATIVO', 'FlexLink', 'X85', 'FL-5566', '2023-06-22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('EQ-008', 'Válvula Neumática', 'Válvula de control direccional', 'NEUMATICO', 'OPERATIVO', 'Festo', 'VUVG', 'FS-3344', '2024-01-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Spare Parts
INSERT INTO spare_parts (code, name, description, stock_quantity, minimum_stock, unit_cost, supplier, created_at, updated_at) VALUES 
('SP-001', 'Filtro de Aceite', 'Filtro estándar compresor', 45, 10, 15.50, 'Filtros Industriales S.A.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SP-002', 'Rodamiento 6204', 'Rodamiento de bolas alta vel.', 5, 20, 45.00, 'Rodamientos del Norte', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SP-003', 'Correa de Transmisión', 'Correa en V perfil B', 12, 15, 22.30, 'Transmisiones Globales', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SP-004', 'Contactor 220V', 'Contactor tripolar 32A', 8, 10, 35.00, 'Materiales Eléctricos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SP-005', 'Sensor Inductivo', 'Sensor M12 PNP', 2, 5, 85.00, 'Sensores & Auto', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SP-006', 'Sello Hidráulico', 'Kit de sellos cilindro', 15, 5, 18.50, 'Hidráulica Sur', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SP-007', 'Fusible 50A', 'Fusible cilíndrico cerámico', 100, 30, 2.50, 'Materiales Eléctricos', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('SP-008', 'Manguera Neumática', 'Tubo PU 8mm (metros)', 200, 50, 1.20, 'Festo Dist', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Maintenance Plans
INSERT INTO maintenance_plans (name, description, equipment_id, frequency, next_execution, active, created_at) VALUES 
('Cambio de Aceite', 'Cambio de aceite y filtro del compresor', 3, 'TRIMESTRAL', '2024-09-15', true, CURRENT_TIMESTAMP),
('Revisión Eléctrica', 'Inspección de contactores y fusibles', 2, 'SEMESTRAL', '2024-10-01', true, CURRENT_TIMESTAMP),
('Lubricación de Torno', 'Engrase de guías lineales', 5, 'MENSUAL', '2024-08-15', true, CURRENT_TIMESTAMP),
('Prueba en Vacío Generador', 'Arranque programado semanal', 6, 'SEMANAL', '2024-08-12', true, CURRENT_TIMESTAMP),
('Inspección de Banda', 'Revisión de tensión de banda y rodillos', 7, 'QUINCENAL', '2024-08-20', true, CURRENT_TIMESTAMP);

-- Work Orders (Assuming user IDs: 1=admin, 2=supervisor, 3=tech1, 4=tech2, 5=tech3)
INSERT INTO work_orders (order_number, equipment_id, reported_by, type, priority, status, description, scheduled_date, created_at) VALUES 
('WO-2024-001', 3, 2, 'PREVENTIVO', 'ALTA', 'PENDIENTE', 'Cambio programado de aceite compresor', '2024-08-15', CURRENT_TIMESTAMP),
('WO-2024-002', 5, 1, 'CORRECTIVO', 'CRITICA', 'EN_PROGRESO', 'Torno no enciende, alarma de servo', '2024-08-10', CURRENT_TIMESTAMP),
('WO-2024-003', 1, 3, 'PREDICTIVO', 'MEDIA', 'COMPLETADA', 'Revisión de ruido inusual en motor', '2024-08-01', CURRENT_TIMESTAMP),
('WO-2024-004', 2, 4, 'CORRECTIVO', 'MEDIA', 'PENDIENTE', 'Reemplazo de contactor ruidoso', '2024-08-12', CURRENT_TIMESTAMP),
('WO-2024-005', 4, 2, 'PREVENTIVO', 'BAJA', 'COMPLETADA', 'Limpieza de filtros hidráulicos', '2024-07-25', CURRENT_TIMESTAMP),
('WO-2024-006', 7, 5, 'PREVENTIVO', 'MEDIA', 'EN_PROGRESO', 'Ajuste de tensión de banda transportadora', '2024-08-11', CURRENT_TIMESTAMP),
('WO-2024-007', 8, 2, 'CORRECTIVO', 'ALTA', 'PENDIENTE', 'Fuga de aire en válvula distribuidora', '2024-08-10', CURRENT_TIMESTAMP),
('WO-2024-008', 6, 1, 'PREDICTIVO', 'MEDIA', 'COMPLETADA', 'Prueba de carga del generador', '2024-08-05', CURRENT_TIMESTAMP);

-- Update some work orders to add assignments and completion data
UPDATE work_orders SET assigned_to = 3, started_at = CURRENT_TIMESTAMP WHERE order_number = 'WO-2024-002';
UPDATE work_orders SET assigned_to = 5, started_at = CURRENT_TIMESTAMP WHERE order_number = 'WO-2024-006';
UPDATE work_orders SET assigned_to = 4, started_at = '2024-08-01 08:00:00', completed_at = '2024-08-01 10:30:00', diagnosis = 'Rodamiento desgastado', solution = 'Se reemplazó el rodamiento', actual_cost = 120.00 WHERE order_number = 'WO-2024-003';
UPDATE work_orders SET assigned_to = 3, started_at = '2024-07-25 09:00:00', completed_at = '2024-07-25 11:00:00', diagnosis = 'Filtro sucio', solution = 'Limpieza profunda', actual_cost = 45.00 WHERE order_number = 'WO-2024-005';
UPDATE work_orders SET assigned_to = 4, started_at = '2024-08-05 14:00:00', completed_at = '2024-08-05 16:00:00', diagnosis = 'Sin novedades', solution = 'Prueba exitosa', actual_cost = 50.00 WHERE order_number = 'WO-2024-008';

-- Work Order Parts
INSERT INTO work_order_parts (work_order_id, spare_part_id, quantity_used) VALUES
(3, 2, 1), -- WO-2024-003 used 1 Rodamiento
(5, 6, 2); -- WO-2024-005 used 2 Sellos
