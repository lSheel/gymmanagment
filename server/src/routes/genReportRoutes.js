import express from 'express';
import connection from '../config/conexion.js'

const router = express.Router();

// Endpoint para crear un nuevo reporte
router.post('/reportes', (req, res) => {
    const { nombre, reporte } = req.body;

    // Validación básica
    if (!nombre || !reporte) {
        return res.status(400).json({
            error: true,
            message: 'Nombre y reporte son campos requeridos'
        });
    }

    // Validar longitud máxima del reporte
    if (reporte.length > 500) {
        return res.status(400).json({
            error: true,
            message: 'El reporte no puede exceder los 500 caracteres'
        });
    }

    const sql = "INSERT INTO Reportes (nombre, reporte) VALUES (?, ?)";
    
    connection.query(sql, [nombre, reporte], (error, results) => {
        if (error) {
            console.error("Error al insertar reporte:", error);
            return res.status(500).json({
                error: true,
                message: 'Ocurrió un error al enviar el reporte',
                details: error.message
            });
        }

        return res.status(201).json({
            error: false,
            message: 'Reporte enviado correctamente. ¡Gracias por tu opinión!'
        });
    });
});

export default router;