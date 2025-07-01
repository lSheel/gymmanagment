import express from 'express';
import jwt from 'jsonwebtoken';
import connection from '../config/conexion.js';

const router = express.Router();
const SECRET_KEY = 'gymmanagment'; // Cambia esto por una clave segura en producción

// Login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario en la base de datos
        const [users] = await connection.promise().query(
            'SELECT * FROM usuarios WHERE correo = ?', 
            [email]
        );


        if (users.length === 0) {
            return res.status(401).json({
                error: true,
                message: 'Credenciales incorrectas'
            });
        }

        const user = users[0];

        // Verificar contraseña
        if(password !== user.password){
            return res.status(401).json({
                error: true,
                message: 'Credenciales incorrectas'
            });
        }

        console.log("genera token");
        // Crear token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.correo,
                rol: user.rol // Asume que tienes un campo 'rol' en tu tabla
            }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );

        res.json({
            error: false,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                nombre: user.nombre_completo,
                email: user.correo,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({
            error: true,
            message: 'Error en el servidor'
        });
    }
});

// Middleware para verificar token
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(authHeader);
    if (!token) {
        return res.status(401).json({
            error: true,
            message: 'Acceso no autorizado'
        });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: true,
                message: 'Token inválido o expirado'
            });
        }
        req.user = user;
        next();
    });
};

router.get('/verify', (req, res) => {
    res.json({
        error: false,
        message: 'Token válido',
        user: req.user // Devuelve la información del usuario del token
    });
});
export default router;