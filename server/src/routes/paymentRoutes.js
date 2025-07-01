import express from 'express';
import connection from '../config/conexion.js';

const router = express.Router();

// Registrar nuevo pago
router.post('/', async (req, res) => {
    const { id_cliente, monto, fecha_pago, metodo_pago } = req.body;

    // Validaciones
    if (!id_cliente || !monto || !fecha_pago || !metodo_pago) {
        return res.status(400).json({
            error: true,
            message: 'Todos los campos son requeridos'
        });
    }

    if (isNaN(monto) || monto <= 0) {
        return res.status(400).json({
            error: true,
            message: 'El monto debe ser un número positivo'
        });
    }

    try {
        const sql = "INSERT INTO Pagos (id_cliente, monto, fecha_pago, metodo_pago) VALUES (?, ?, ?, ?)";
        const [results] = await connection.promise().execute(sql, [id_cliente, monto, fecha_pago, metodo_pago]);

        return res.status(201).json({
            error: false,
            message: 'Pago registrado correctamente',
            id_pago: results.insertId
        });
    } catch (error) {
        console.error("Error al registrar pago:", error);
        return res.status(500).json({
            error: true,
            message: 'Error al registrar el pago',
            details: error.message
        });
    }
});

// Consultar pagos
router.get('/', async (req, res) => {
    const { busqueda } = req.query;

    if (!busqueda) {
        // Si no hay búsqueda, devolver todos los pagos
        try {
            const sql = "SELECT p.*, c.nombre_completo FROM Pagos p JOIN Clientes c ON p.id_cliente = c.id_cliente";
            const [results] = await connection.promise().query(sql);
            
            return res.json({
                error: false,
                pagos: results
            });
        } catch (error) {
            console.error("Error al consultar pagos:", error);
            return res.status(500).json({
                error: true,
                message: 'Error al consultar pagos',
                details: error.message
            });
        }
    }

    // Si hay búsqueda
    try {
        let sql, params;
        
        if (isNaN(busqueda)) {
            sql = "SELECT p.*, c.nombre_completo FROM Pagos p JOIN Clientes c ON p.id_cliente = c.id_cliente WHERE c.nombre_completo LIKE ?";
            params = [`%${busqueda}%`];
        } else {
            sql = "SELECT p.*, c.nombre_completo FROM Pagos p JOIN Clientes c ON p.id_cliente = c.id_cliente WHERE p.id_cliente = ?";
            params = [busqueda];
        }

        const [results] = await connection.promise().execute(sql, params);

        return res.json({
            error: false,
            pagos: results
        });
    } catch (error) {
        console.error("Error al consultar pagos:", error);
        return res.status(500).json({
            error: true,
            message: 'Error al consultar pagos',
            details: error.message
        });
    }
});

// Anular pago
router.put('/anular/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = "UPDATE Pagos SET anulado = 1 WHERE id_pago = ?";
        const [results] = await connection.promise().execute(sql, [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({
                error: true,
                message: 'Pago no encontrado'
            });
        }

        return res.json({
            error: false,
            message: '✅ Pago anulado correctamente'
        });
    } catch (error) {
        console.error("Error al anular pago:", error);
        return res.status(500).json({
            error: true,
            message: 'Error al anular el pago',
            details: error.message
        });
    }
});

export default router;