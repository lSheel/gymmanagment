import express from 'express';
import connection from '../config/conexion.js';

const router = express.Router();

// Registrar nuevo cliente
router.post('/', async (req, res) => {
    const { 
        nombre_completo, 
        telefono, 
        direccion, 
        genero, 
        fecha_nacimiento, 
        correo 
    } = req.body;

    // Validaciones básicas
    if (!nombre_completo || !genero) {
        return res.status(400).json({
            error: true,
            message: 'Nombre completo y género son campos requeridos'
        });
    }

    // Generar fecha de inscripción automática
    const fecha_inscripcion = new Date().toISOString().split('T')[0];

    try {
        const sql = `INSERT INTO clientes 
                    (nombre_completo, telefono, direccion, genero, 
                     fecha_nacimiento, correo, fecha_inscripcion) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
        const [results] = await connection.promise().execute(sql, [
            nombre_completo,
            telefono,
            direccion,
            genero,
            fecha_nacimiento,
            correo,
            fecha_inscripcion
        ]);

        return res.status(201).json({
            error: false,
            message: 'Cliente registrado correctamente',
            id_cliente: results.insertId,
            fecha_inscripcion: fecha_inscripcion
        });
    } catch (error) {
        console.error("Error al registrar cliente:", error);
        return res.status(500).json({
            error: true,
            message: 'Error al registrar cliente',
            details: error.message
        });
    }
});

export default router;