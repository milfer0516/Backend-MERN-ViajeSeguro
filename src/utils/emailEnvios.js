import { createError } from '../utils/error.js';
import nodemailer from 'nodemailer';

/* export const emailConfirmarCuenta = async ( correo, token, nombre ) => {

    let transporter = nodemailer.createTransport({

        host: process.env.MAILTRAP_EMAIL_HOST,
        port: 225,
        secure: false,
        auth: {
            user: process.env.MAILTRAP_EMAIL_USER,
            pass: process.env.MAILTRAP_EMAIL_PASSWORD
        },
        
    });

     try {

        let info = await transporter.sendMail({
        from: `ViajeSeguro - Sitio de Reservas de Transporte viajeSeguro@example.com`,
        to: correo,
        subject: "ViajeSeguro - Confirma tu cuenta. ",
        text: "Comprueba tu cuenta en ViajeSeguro.",
        html: `
            <div class="container">

                <h1>Hola ${nombre} bienvenido a ViajeSeguro tu sitio de Reservas </h1>
                <p class="text">Comprueba tu cuenta en ViajeSeguro</p>
                    <p>Tu cuenta ya esta casi lista solo debes comprobar tu cuenta en el
                    siguiente enlace: <a href="${process.env.FRONTEND_URL_CONFIRMAR}/confirmar-cuenta/${token}">Comprobar Cuenta</a></p>
                <p>Si tu no creaste está cuenta, Ignora este mensaje</p>
                
            </div>
        `
    })

    console.log(info.messageId);
     } catch (error) {
        console.log("Error al enviar el correo de confirmacion: ", correo);
        return createError(501, `Error al eviar el correo ${correo} al servidor Mailtrap`)
     }
}; */

export const emailNuevoPassword = async ( correo, token, nombre ) => {

    let transporter = nodemailer.createTransport({

        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "milfer16@gmail.com",
            pass: process.env.PASSWORD_GMAIL
        },
    });

    /* console.log("Correo: ", correo)
    console.log("Token: ", token);
    console.log("Nombre: ", nombre); */

     try {

        let info = await transporter.sendMail({
        from: `ViajeSeguro - Sitio de Reservas de Transporte viajeSeguro@example.com`,
        to: correo,
        subject: "ViajeSeguro - Reestablece Contraseña. ",
        text: "Reestablece tu contraseña.",
        html: `
            <div class="container">

                <h1>Hola ${nombre} has solicitado reestablecer tu contraseña </h1>
                <p class="text">Modifica tu contraseña - ViajeSeguro</p>
                    <p>La recuperación de tu contraseña ya esta casi lista solo debes dar click en elsiguiente enlace: <a href="${process.env.FRONTEND_URL_CONFIRMAR}/nuevo-password/${token}">Modificar tu contraseña</a></p>
                <p>Si tu no solicitaste este email, Puedes ignorar este mensaje</p>
                
            </div>
        `
    })

    console.log(info.messageId);
     } catch (error) {
        return error
     }
};

export const emailConfirmarCuenta = async ( correo, token, nombre ) => {

    let transporter = nodemailer.createTransport({

        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "milfer16@gmail.com",
            pass: process.env.PASSWORD_GMAIL
        },
        
    });

     try {

        let info = await transporter.sendMail({
        from: `ViajeSeguro - Sitio de Reservas de Transporte viajeSeguro@example.com`,
        to: correo,
        subject: "ViajeSeguro - Confirma tu cuenta. ",
        text: "Comprueba tu cuenta en ViajeSeguro.",
        html: `
            <div class="container">

                <h3>Hola ${nombre} bienvenido a ViajeSeguro tu sitio de Reservas </h3>
                <p class="text">Comprueba tu cuenta en ViajeSeguro</p>
                    <p>Tu cuenta ya esta casi lista solo debes comprobar tu cuenta en el
                    siguiente enlace: <a href="${process.env.FRONTEND_URL_CONFIRMAR}/confirmar-cuenta/${token}">Comprobar Cuenta</a></p>
                <p>Si tu no creaste está cuenta, Ignora este mensaje</p>
                
            </div>
        `
    })

    //console.log(info);
    return info
     } catch (error) {
        console.log("Error al enviar el correo de confirmacion: ", correo);
        return createError(500, `Error al eviar el correo ${correo} al servidor Mailtrap`)
     }
};




