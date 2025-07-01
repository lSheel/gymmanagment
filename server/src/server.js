import cors from "cors";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import clientRoutes from "./routes/clientRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import genReportRoutes from "./routes/genReportRoutes.js";
import paymantRoutes from "./routes/paymentRoutes.js";
import registerClientRoutes from "./routes/registerClientRoutes.js";
import authRouter, { authenticateToken } from "./routes/authRoutes.js";
import accesoGymRouter from './routes/accessRoutes.js';

const server = express();

server.use(cors());

// Leer datos de formularios

server.use(morgan("dev"));
server.use(express.json());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use("/api/auth", authRouter);
server.use("/api/clientes", authenticateToken, clientRoutes);
server.use("/api/reportes", authenticateToken, reportRoutes);
server.use("/api/membresias", authenticateToken, membershipRoutes);
server.use("/api/reporte", authenticateToken, genReportRoutes);
server.use("/api/pagos", authenticateToken, paymantRoutes);
server.use("/api/registrarCliente", authenticateToken, registerClientRoutes);
server.use('/api/acceso-gym', accesoGymRouter);
export default server;
