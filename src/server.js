import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import  { connectionDB }  from './database/connectionDB.js'
import routerVehiculos from './routes/vehiculosRoute.js';
import routerRegistarse from './routes/autencticacionRoutes.js'
import handlerErrors from './middlewares/handlerErrors.js';

//import { handlerErrors } from './middlewares/handlerErrors.js';


class Server {

    constructor () {
        this.app = express();
        this.port = process.env.PORT || 3001;
        //Rutas
        this.pathVehiculos = '/api/vehiculos';
        this.registrarse   = '/api/usuarios';

        // Conexión a la DB
        this.connectDB();

        //Middlewares
        this.middlaware();

        //Rutas
        this.routes();
    }
    routes() {
        this.app.use(this.pathVehiculos, routerVehiculos);
        this.app.use(this.registrarse, routerRegistarse)
        
    }

    middlaware() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(cookieParser());
        this.app.use(express.json());
    }

    connectDB() {
        connectionDB();
    }
    CustErros() {
        this.app.use(handlerErrors)
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto ${this.port}`);
        })
    }
}

export default Server;