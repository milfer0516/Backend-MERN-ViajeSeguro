import jwt from 'jsonwebtoken';

export const createToken = ( payload ) => {

    return new Promise(( resolve, reject ) => {
        jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '2h'
        },
        (error, token) => {
            if(error) reject(error);
            //console.log("Generando Token:", token);
            resolve(token)
        }
    )
    })
}