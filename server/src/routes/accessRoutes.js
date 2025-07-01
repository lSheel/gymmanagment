import express from 'express';
import connection from '../config/conexion.js'

const router = express.Router();

router.post('/verificar-acceso', async (req, res) => {
    const { nombre_completo } = req.body;

    if (!nombre_completo) {
        return res.status(400).json({
            error: true,
            message: 'El nombre de usuario es requerido'
        });
    }

    try {
        // 1. Primero buscar el cliente por nombre (con LIKE para mayor flexibilidad)
        const [clientes] = await connection.promise().query(
            `SELECT c.id_cliente, c.nombre_completo, m.estado, m.fecha_fin
             FROM clientes c
             LEFT JOIN membresias m ON c.id_cliente = m.id_cliente
             WHERE c.nombre_completo LIKE ? 
             ORDER BY m.fecha_fin DESC
             LIMIT 1`,
            [`%${nombre_completo}%`]
        );

        console.log('Resultados de la consulta:', clientes); // Log para depuración

        if (clientes.length === 0) {
            return res.json({
                error: true,
                message: 'Cliente no encontrado en el sistema'
            });
        }

        const cliente = clientes[0];

        // 2. Verificar si tiene membresía activa
        if (!cliente.estado || cliente.estado !== 'activa') {
            return res.json({
                error: true,
                message: 'El cliente no tiene membresía activa'
            });
        }

        // 3. Verificar fecha de vencimiento
        const hoy = new Date();
        const fechaVencimiento = new Date(cliente.fecha_vencimiento);

        if (fechaVencimiento < hoy) {
            return res.json({
                error: true,
                message: 'La membresía está vencida'
            });
        }

        // Si pasa todas las validaciones
        return res.json({
            error: false,
            message: `¡Bienvenido ${cliente.nombre_completo}!`,
            cliente: {
                id: cliente.id_cliente,
                nombre: cliente.nombre_completo
            }
        });

    } catch (error) {
        console.error("Error en la consulta:", error);
        return res.status(500).json({
            error: true,
            message: 'Error en el servidor al verificar acceso',
            details: error.message
        });
    }
});

export default router;