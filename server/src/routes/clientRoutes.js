
import express from "express";
import connection from "../config/conexion.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const sql = "SELECT * FROM Clientes";

  try {
    const [results] = await connection.promise().execute(sql);

    res.json({
      success: true,
      count: results.length,
      clientes: results,
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    return res.status(500).json({
      error: true,
      message: "Error al obtener los clientes",
      details: error.message,
    });
  }
});

router.post("/eliminar-cliente", async (req, res) => {
  const { id_cliente } = req.body;

  if (!id_cliente) {
    return res.status(400).json({
      error: true,
      message: "Se requiere el ID del cliente",
    });
  }

  const sql = "DELETE FROM Clientes WHERE id_cliente = ?";

  try {
    const [results] = await connection.promise().execute(sql, [id_cliente]);

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
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    return res.status(500).json({
      error: true,
      message: "Error al eliminar el cliente",
      details: error.message,
    });
  }
});

export default router;
