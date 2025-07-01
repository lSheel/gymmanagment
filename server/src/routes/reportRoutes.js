import express, { json } from "express";
import connection from "../config/conexion.js";

const router = express.Router();

router.get("/reporte-membresias", (req, res) => {
  // Obtener parámetros de consulta
  const { estado, tipo, fecha_inicio, fecha_fin } = req.query;
  console.log(estado, tipo, fecha_fin, fecha_inicio);

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

  if (estado && estado !== "all") {
    conditions.push(`m.estado = '${escapeSqlParam(estado)}'`);
  }

  if (tipo && tipo !== "all") {
    conditions.push(`m.tipo = '${escapeSqlParam(tipo)}'`);
  }

  if (fecha_inicio) {
    conditions.push(`m.fecha_inicio >= '${escapeSqlParam(fecha_inicio)}'`);
  }

  if (fecha_fin) {
    conditions.push(`m.fecha_fin <= '${escapeSqlParam(fecha_fin)}'`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += ` ORDER BY m.fecha_inicio DESC`;

  console.log(sql);
  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Error en la consulta:", error);
      return res.status(500).json({
        error: true,
        message: "Error al obtener las membresías",
        details: error.message,
      });
    }

    res.json({
      success: true,
      count: results.length,
      membresias: results,
    });
  });
});

router.get("/reporte-pagos", (req, res) => {
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

  if (metodo && metodo !== "all") {
    conditions.push(`p.metodo_pago = '${escapeSqlParam(metodo)}'`);
  }

  if (fecha_inicio) {
    conditions.push(`p.fecha_pago >= '${escapeSqlParam(fecha_inicio)}'`);
  }

  if (fecha_fin) {
    conditions.push(`p.fecha_pago <= '${escapeSqlParam(fecha_fin)}'`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += ` ORDER BY p.fecha_pago DESC`;


  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Error en la consulta:", error);
      return res.status(500).json({
        error: true,
        message: "Error al obtener los pagos",
        details: error.message,
      });
    }

    res.json({
      success: true,
      count: results.length,
      pagos: results,
    });
  });
});


router.get("/reporte-comentarios", (req, res) => {
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

  if (fecha_inicio) {
    conditions.push(`fecha >= '${escapeSqlParam(fecha_inicio)}'`);
  }

  if (fecha_fin) {
    conditions.push(`fecha <= '${escapeSqlParam(fecha_fin)}'`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += ` ORDER BY fecha DESC`;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Error en la consulta:", error);
      return res.status(500).json({
        error: true,
        message: "Error al obtener los reportes",
        details: error.message,
      });
    }

    res.json({
      success: true,
      count: results.length,
      reportes: results,
    });
  });
});

function escapeSqlParam(param) {
  return param.replace(/['"\\]/g, "");
}

export default router;
