import mongoose from 'mongoose';

export const connectionDB = async () => {
    
    try {
        await mongoose.connect(process.env.DB_CONNECTION_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true, 
        })

        console.log("Conexión exitosa a la Base de Datos")
    } catch (error) {
        console.log(error)
        throw new Error('Error en la conexión a la Base de Datos')
    }

    /* mongoose.connection.on("desconectado", () => {
        console.log("MongoDB desconectado")
    })
    mongoose.connection.on("conectado", () => {
        console.log("MongoDB conectado")
    }) */
    
}