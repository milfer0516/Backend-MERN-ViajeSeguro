import Usuario from "../models/Usuario.js";


export const validEmail = ( value ) => {

  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
   return regexCorreo.test(value);
}

export const validUsuario = async ( correo ) => {

    const userFound = await Usuario.findOne({ correo });

    if(userFound) {throw new Error("El usuario ya se encuentra registrado")}
  
    return true;
}

export const validPhoneUsuario = async ( telefono ) => {

  const phoneFound = await Usuario.findOne({ telefono })

  if( phoneFound ) throw new Error("El número de telefono ya se encuentra registrado")
}

