import express from "express";
import connection from "../config/conexion.js";

const router = express.Router();

router.get("/reporte-membresias", async (req, res) => {
  const { estado, tipo, fecha_inicio, fecha_fin } = req.query;

  let sql = `
        SELECT 
            m.id_membresia, 
            c.nombre_completo, 
            m.tipo, 
            m.fecha_inicio, 
            m.fecha_fin, 
            m.estado
        FROM Membresias m
        JOIN Clientes c ON m.id_cliente = c.id_cliente
    `;

  const conditions = [];
  const params = [];

  if (estado && estado !== "all") {
    conditions.push(`m.estado = ?`);
    params.push(estado);
  }

  if (tipo && tipo !== "all") {
    conditions.push(`m.tipo = ?`);
    params.push(tipo);
  }

  if (fecha_inicio) {
    conditions.push(`m.fecha_inicio >= ?`);
    params.push(fecha_inicio);
  }

  if (fecha_fin) {
    conditions.push(`m.fecha_fin <= ?`);
    params.push(fecha_fin);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += ` ORDER BY m.fecha_inicio DESC`;

  try {
    const [results] = await connection.promise().execute(sql, params);

    res.json({
      success: true,
      count: results.length,
      membresias: results,
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    return res.status(500).json({
      error: true,
      message: "Error al obtener las membresías",
      details: error.message,
    });
  }
});

router.get("/reporte-pagos", async (req, res) => {
  const { metodo, fecha_inicio, fecha_fin } = req.query;

  let sql = `
        SELECT 
            p.id_pago,
            p.id_cliente,
            c.nombre_completo,
            p.fecha_pago,
            p.monto,
            p.metodo_pago
        FROM Pagos p
        JOIN Clientes c ON p.id_cliente = c.id_cliente
    `;

  const conditions = [];
  const params = [];

  if (metodo && metodo !== "all") {
    conditions.push(`p.metodo_pago = ?`);
    params.push(metodo);
  }

  if (fecha_inicio) {
    conditions.push(`p.fecha_pago >= ?`);
    params.push(fecha_inicio);
  }

  if (fecha_fin) {
    conditions.push(`p.fecha_pago <= ?`);
    params.push(fecha_fin);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += ` ORDER BY p.fecha_pago DESC`;

  try {
    const [results] = await connection.promise().execute(sql, params);

    res.json({
      success: true,
      count: results.length,
      pagos: results,
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    return res.status(500).json({
      error: true,
      message: "Error al obtener los pagos",
      details: error.message,
    });
  }
});

router.get("/reporte-comentarios", async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;

  let sql = `
        SELECT 
            id_reporte,
            nombre,
            reporte,
            fecha
        FROM reportes
    `;

  const conditions = [];
  const params = [];

  if (fecha_inicio) {
    conditions.push(`fecha >= ?`);
    params.push(fecha_inicio);
  }

  if (fecha_fin) {
    conditions.push(`fecha <= ?`);
    params.push(fecha_fin);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += ` ORDER BY fecha DESC`;

  try {
    const [results] = await connection.promise().execute(sql, params);

    res.json({
      success: true,
      count: results.length,
      reportes: results,
    });
  } catch (error) {
    console.error("Error en la consulta:", error);
    return res.status(500).json({
      error: true,
      message: "Error al obtener los reportes",
      details: error.message,
    });
  }
});

export default router;
