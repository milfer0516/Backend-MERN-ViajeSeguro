import dotEnv from 'dotenv';
import express from 'express';
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import  { connectionDB }  from './database/connectionDB.js'
import routerVehiculos from './routes/vehiculosRoute.js';
import routerRegistarse from './routes/autencticacionRoutes.js';
import routerUsers from "./routes/usuariosRoute.js";
import routerCategoria from "./routes/categoriasRoute.js";
import routerReserva from './routes/reservasRouter.js'
import handlerError from './middlewares/handlerErrors.js';
dotEnv.config()


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3500 ;

// Connection DB
connectionDB();

// Configuracion CORS
const whiteList = [ process.env.FRONTEND_URL ];

//middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
}));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://viaje-seguro.vercel.app'); // Reemplaza con el origen de tu aplicación Vercel
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Ajusta los métodos permitidos según sea necesario
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Ajusta las cabeceras permitidas según sea necesario

  next();
});


//Routes
app.use("/api/vehiculos", routerVehiculos);
app.use("/api/usuarios", routerRegistarse);
app.use("/api/usuarios", routerUsers);
app.use("/api/categorias", routerCategoria);
app.use("/api/reservas", routerReserva);

app.use(handlerError);

//server
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
    
})
