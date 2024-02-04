import mongoose, { Schema } from 'mongoose'

const CategoriaSchema = new Schema({

    nombreCategoria : {
        type: String,
        required: true,
        trim: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    maxPasajeros : {
        type: Number,
        required: true,
        trim: true,
    },
    imagenCategoria : {
        type: [String],
        
    },
    precioKilometro: {
        type: Number,
        required: true, 
        trim: true,
    },
    vehiculos: [{
        type: Schema.Types.ObjectId, 
        ref: 'Vehiculo'
    }]
});

export default mongoose.model("Categoria", CategoriaSchema);

// Actualiza la colección Categoria
/* (async () => {
categoriaId.set({}, { $set: { vehiculos: [] } });
console.log('Colección Categoria actualizada');
})(); */