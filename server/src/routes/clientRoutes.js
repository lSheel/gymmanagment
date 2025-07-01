
import express, { json } from "express";
import  connection  from "../config/conexion.js";

const router = express();

router.get("/", (req, res) => {
  const sql = "SELECT * FROM Clientes";

  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Error en la consulta:", error);
      return res.status(500).json({
        error: true,
        message: "Error al obtener los clientes",
        details: error.message,
      });
    }
    
    res.json({
      success: true,
      count: results.length,
      clientes: results,
    });
  });
});

router.post("/eliminar-cliente", json(), (req, res) => {
  const { id_cliente } = req.body;

  if (!id_cliente) {
    return res.status(400).json({
      error: true,
      message: "Se requiere el ID del cliente",
    });
  }

  const sql = "DELETE FROM Clientes WHERE id_cliente = ?";

  connection.query(sql, [id_cliente], (error, results) => {
    if (error) {
      console.error("Error al eliminar cliente:", error);
      return res.status(500).json({
        error: true,
        message: "Error al eliminar el cliente",
        details: error.message,
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        error: true,
        message: "Cliente no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Cliente eliminado correctamente",
      affectedRows: results.affectedRows,
    });
  });
});

export default router;
