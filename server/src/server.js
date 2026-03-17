import cors from "cors";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
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

// Rate limiting: strict limit for auth endpoints to prevent brute force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: true, message: 'Demasiados intentos. Intente de nuevo más tarde.' }
});

// Rate limiting: general limit for all other API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: true, message: 'Demasiadas solicitudes. Intente de nuevo más tarde.' }
});

server.use("/api/auth", authLimiter, authRouter);
server.use("/api/clientes", apiLimiter, authenticateToken, clientRoutes);
server.use("/api/reportes", apiLimiter, authenticateToken, reportRoutes);
server.use("/api/membresias", apiLimiter, authenticateToken, membershipRoutes);
server.use("/api/reporte", apiLimiter, authenticateToken, genReportRoutes);
server.use("/api/pagos", apiLimiter, authenticateToken, paymantRoutes);
server.use("/api/registrarCliente", apiLimiter, authenticateToken, registerClientRoutes);
server.use('/api/acceso-gym', apiLimiter, accesoGymRouter);
export default server;
