-- Insert Admin User (password: admin123)
INSERT INTO users (username, email, password_hash, full_name, role, active, created_at)
VALUES ('admin', 'admin@cmms.com', '$2a$10$pHqvIyM/X9W4aq/XfWfDouhkZBL0TzPT4DPCCmqDp.IJr6a2sUGRm', 'Administrador del Sistema', 'ADMIN', true, CURRENT_TIMESTAMP);

-- Insert Equipment
INSERT INTO equipment (code, name, description, category, status, created_at, updated_at) 
VALUES ('EQ-001', 'Motor Principal', 'Motor de la cinta transportadora A', 'MECANICO', 'OPERATIVO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO equipment (code, name, description, category, status, created_at, updated_at) 
VALUES ('EQ-002', 'Panel Eléctrico Central', 'Panel de control de la nave 1', 'ELECTRICO', 'OPERATIVO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert Spare Parts
INSERT INTO spare_parts (code, name, description, stock_quantity, minimum_stock, unit_cost, supplier, created_at, updated_at)
VALUES ('SP-001', 'Filtro de Aceite', 'Filtro para motor principal', 50, 10, 15.50, 'Filtros Industriales S.A.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO spare_parts (code, name, description, stock_quantity, minimum_stock, unit_cost, supplier, created_at, updated_at)
VALUES ('SP-002', 'Rodamiento 6204', 'Rodamiento de bolas', 5, 20, 45.00, 'Rodamientos del Norte', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
