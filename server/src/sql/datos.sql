-- Insertar usuarios
INSERT INTO `usuarios` (`id_usuario`, `nombre_usuario`, `password`, `rol`, `correo`, `fecha_registro`) VALUES
(1, 'admin_gym', 'admin', 'administrador', 'admin@gymmanagement.com', '2025-01-15 08:00:00'),
(2, 'empleado1', 'empleado1', 'empleado', 'empleado1@gymmanagement.com', '2025-02-20 09:15:00'),
(3, 'entrenador_juan', 'trainerjuan', 'empleado', 'juan.entrenador@gym.com', '2025-03-10 10:30:00');

-- Insertar clientes
INSERT INTO `clientes` (`id_cliente`, `nombre_completo`, `telefono`, `direccion`, `genero`, `fecha_nacimiento`, `correo`, `fecha_inscripcion`, `estado`) VALUES
(1, 'Carlos Mendez', '5551234567', 'Calle Primavera 123', 'Masculino', '1990-05-15', 'carlos.mendez@email.com', '2025-01-20', 'activo'),
(2, 'Ana Rodriguez', '5552345678', 'Avenida Sol 456', 'Femenino', '1985-08-22', 'ana.rodriguez@email.com', '2025-02-05', 'activo'),
(3, 'Luis Garcia', '5553456789', 'Boulevard Luna 789', 'Masculino', '1995-03-30', 'luis.garcia@email.com', '2025-03-15', 'inactivo'),
(4, 'Maria Fernandez', '5554567890', 'Calle Estrella 321', 'Femenino', '1988-11-10', 'maria.fernandez@email.com', '2025-04-01', 'activo'),
(5, 'Jorge Lopez', '5555678901', 'Avenida Tierra 654', 'Masculino', '1992-07-25', 'jorge.lopez@email.com', '2025-05-10', 'activo');

-- Insertar membresías
INSERT INTO `membresias` (`id_membresia`, `id_cliente`, `tipo`, `fecha_inicio`, `fecha_fin`, `estado`) VALUES
(1, 1, 'anual', '2025-01-20', '2026-01-20', 'activa'),
(2, 2, 'trimestral', '2025-02-05', '2025-05-05', 'vencida'),
(3, 3, 'mensual', '2025-03-15', '2025-04-15', 'cancelada'),
(4, 4, 'anual', '2025-04-01', '2026-04-01', 'activa'),
(5, 5, 'trimestral', '2025-05-10', '2025-08-10', 'activa');

-- Insertar pagos
INSERT INTO `pagos` (`id_pago`, `id_cliente`, `monto`, `fecha_pago`, `metodo_pago`, `comprobante`, `anulado`) VALUES
(1, 1, 1200.00, '2025-01-20', 'tarjeta_credito', 'COMP-001', 0),
(2, 2, 900.00, '2025-02-05', 'efectivo', NULL, 0),
(3, 3, 300.00, '2025-03-15', 'tarjeta_debito', 'COMP-003', 1),
(4, 4, 1200.00, '2025-04-01', 'tarjeta_credito', 'COMP-004', 0),
(5, 5, 900.00, '2025-05-10', 'efectivo', NULL, 0);

-- Insertar reportes
INSERT INTO `reportes` (`id_reporte`, `nombre`, `reporte`, `fecha`) VALUES
(1, 'Carlos Méndez', 'El equipo de cardio necesita mantenimiento', '2025-02-15 14:30:00'),
(2, 'Ana Rodríguez', 'Falta papel higiénico en los baños', '2025-03-20 16:45:00'),
(3, 'Jorge López', 'Sugerencia: agregar más clases nocturnas', '2025-05-15 18:20:00');

-- Insertar logs de acceso
INSERT INTO `logsacceso` (`id_log`, `id_usuario`, `accion`, `fecha`) VALUES
(1, 1, 'Inicio de sesión', '2025-06-01 08:05:00'),
(2, 1, 'Registro de nuevo cliente', '2025-06-01 08:30:00'),
(3, 2, 'Inicio de sesión', '2025-06-01 09:15:00'),
(4, 3, 'Inicio de sesión', '2025-06-02 10:00:00'),
(5, 1, 'Cierre de sesión', '2025-06-02 18:00:00');