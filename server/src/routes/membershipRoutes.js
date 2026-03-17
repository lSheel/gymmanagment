import { Router } from 'express';
import connection from "../config/conexion.js";
const router = Router();

router.post('/asignar', async (req, res) => {
  const { id_cliente, tipo_membresia } = req.body;

  if (!id_cliente || !tipo_membresia) {
    return res.status(400).json({ success: false, message: 'id_cliente y tipo_membresia son requeridos' });
  }

  const clientId = parseInt(id_cliente, 10);
  if (isNaN(clientId) || clientId <= 0) {
    return res.status(400).json({ success: false, message: 'id_cliente debe ser un número entero positivo' });
  }

  const fecha_inicio = new Date().toISOString().split('T')[0];
  
  let fecha_fin;
  switch (tipo_membresia) {
    case 'bimestral':
      fecha_fin = new Date();
      fecha_fin.setMonth(fecha_fin.getMonth() + 2);
      break;
    case 'trimestral':
      fecha_fin = new Date();
      fecha_fin.setMonth(fecha_fin.getMonth() + 3);
      break;
    case 'anual':
      fecha_fin = new Date();
      fecha_fin.setFullYear(fecha_fin.getFullYear() + 1);
      break;
    default:
      return res.status(400).json({ success: false, message: 'Tipo de membresía inválido' });
  }

  fecha_fin = fecha_fin.toISOString().split('T')[0];

  const sql = 'INSERT INTO Membresias (id_cliente, tipo, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)';

  try {
    const [results] = await connection.promise().execute(sql, [clientId, tipo_membresia, fecha_inicio, fecha_fin]);

    res.json({ 
      success: true, 
      message: 'Membresía asignada correctamente',
      data: {
        id_membresia: results.insertId,
        id_cliente,
        tipo: tipo_membresia,
        fecha_inicio,
        fecha_fin,
        estado: 'activa'
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al asignar la membresía',
      details: error.message 
    });
  }
});

router.post('/cancelar', async (req, res) => {
  const { id_membresia } = req.body;

  if (!id_membresia) {
    return res.status(400).json({ success: false, message: 'id_membresia es requerido' });
  }

  const sql = 'UPDATE Membresias SET estado = "cancelada" WHERE id_membresia = ?';

  try {
    const [results] = await connection.promise().execute(sql, [id_membresia]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No se encontró la membresía' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Membresía cancelada correctamente' 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error al cancelar la membresía',
      details: error.message 
    });
  }
});

export default router;