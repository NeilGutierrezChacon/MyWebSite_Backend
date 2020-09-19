const jwt = require('jsonwebtoken');
const querystring = require('querystring');  

/**
 * @file verifyToken.js
 *  
 * @description En este fichero definimos el middlewere para la verificación de un token.
 */ 

/**
 * @function verifyToken
 * @description Nos autentifica el token segun los parametros secretos configurados.
 * 
 * @param {*} req Requiere una que se mande el token de acceso en las cookies
 * @param {*} res Responde un mensaje de error si la autentificación falla.
 * @param {*} next Funcion que se ejecutara después.
 */

async function verifyToken(req, res, next) {
    const token = req.cookies.token;
    console.log("Token: ",token);
    try{
        const decoded = await jwt.verify(token,process.env.TOKEN_SECRET);
        console.log(decoded);
        console.log("decoded token: ",decoded.adminName);
        req.adminName = decoded.adminName;
    }catch(e){
        let query = querystring.stringify({
            "message":"Don't have token"
            });
        return res.status(401).redirect(`/Admin/?${query}`);
    }
    next();
}

module.exports = verifyToken;