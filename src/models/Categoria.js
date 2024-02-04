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
    }
});

export default mongoose.model("Categoria", CategoriaSchema)