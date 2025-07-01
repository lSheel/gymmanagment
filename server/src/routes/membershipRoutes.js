import { Router } from 'express';
import  connection  from "../config/conexion.js";
const router = Router();

router.post('/asignar', (req, res) => {
  const { id_cliente, tipo_membresia } = req.body;
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
  
  connection.query(sql, [parseInt(id_cliente), tipo_membresia, fecha_inicio, fecha_fin], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al asignar la membresía',
        details: error.message 
      });
    }

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
  });
});

router.post('/cancelar', (req, res) => {
  const { id_membresia } = req.body;
  
  const sql = 'UPDATE Membresias SET estado = "cancelada" WHERE id_membresia = ?';
  
  connection.query(sql, [id_membresia], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error al cancelar la membresía',
        details: error.message 
      });
    }

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
  });
});

export default router;