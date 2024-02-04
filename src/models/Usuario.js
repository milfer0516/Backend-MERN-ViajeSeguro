import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs';

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    telefono: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    tokenID: {
        type: String
    },
    confirmado: {
        type: Boolean,
        default: false
    },
    estado: {
        type: Boolean,
        default: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    
},
    {
        timestamps: true
    }
);

/* Este es usado para poder ocultar ciertos campos que no sean visto al momento de guardar un usuario */
UsuarioSchema.methods.toJSON = function() {
    const { __v, password, isAdmin, ...usuario } = this.toObject();
    return usuario;
}

/* Funcion o Metodo para Hashear el password */
UsuarioSchema.pre('save', async function( next ) {
    //Verificamos si el password no ha sido modificado
    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UsuarioSchema.methods.comparePassword = async function ( passForm ) {

    return await bcrypt.compare(passForm, this.password);

}

export default mongoose.model("Usuario", UsuarioSchema);