import mongoose, { Schema } from 'mongoose'

const ReservaSchema = new Schema({

    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario' 
    },
    
    vehiculo: { 
        type: Schema.Types.ObjectId, 
        ref: 'Vehiculo' 
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

/* ReservaSchema.virtual('fechaInicio')
.set(function(fecha) {
    // El formato esperado es 'yyyy-mm-dd' que es el devuelto por el campo input
    // el valor recibido se almacenará en el campo fecha_nacimiento_iso de nuestro documento
    this.fechaInicioISO = new Date(fecha)
}).get(function() {
    // el valor devuelto será un string en formato 'yyyy-mm-dd'
    return this.fechaInicioISO.toISOString().substring(0,10);
}) */


export default mongoose.model("Reserva", ReservaSchema);

