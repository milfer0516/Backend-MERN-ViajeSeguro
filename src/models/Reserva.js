import mongoose, { Schema } from 'mongoose'

const ReservaSchema = new Schema({

    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario' 
    },
    
    categoria: { 
        type: Schema.Types.ObjectId, 
        ref: 'Categoria' 
    },
    fechaInicio: {
        type: Date,
        required: true,
    },
    fechaFin: {
        type: Date,
        required: true,
    },
    horaReserva: {
        type: String,
        required: true,
    },
    destinoInicial: {
        type: String,
        trim: true,
        required: true,
    },
    distancia: {
        type: Number,
        trim: true,
    },
    tiempoRecorrido: {
        type: [Number],
        trim: true,
        required: true,
    },
    coordenadasInicio: {
        type: [Number],
        index: '2dsphere'
    },
    destinoFinal: {
        type: String,
        trim: true,
        required: true,
    },
    coordenadasFinales: {
      type: [Number],
      index: '2dsphere'
  },
    estado: {
        type: Boolean,
        default: false
    },
     
},
    {
        timestamps: true
    }
    
);



export default mongoose.model("Reserva", ReservaSchema);

