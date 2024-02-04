import mongoose, { Schema } from 'mongoose'

const VehiculoSchema = new Schema({

    nombre: {
        type: String,
        required: true,
        trim: true
    },
    nombre_conductor: {
        type: String,
        required: true,
        trim: true
    },
    placa: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    
    estado: {
        type: String,
        enum: ["Disponible", "Reservado", "Fuera de Servicio"],
        default: "Disponible"
    },
    categoria : { 
        type: Schema.Types.ObjectId, 
        ref: 'Categoria'
    },
    
    foto: {
        type: [String],
        required: false
    },

}, {
    timestamps: true
})

export default mongoose.model("Vehiculo", VehiculoSchema);

