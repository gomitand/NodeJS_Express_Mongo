
const Usuario = require('../models/usuario_model');
const Joi = require('@hapi/joi');




//validaciones para el objeto usuario

const Schema = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(30)
        .required()
        .pattern(/^[A-Za-záéíóú ]{3,30}$/),
    
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/),
    
    email:Joi.string()
        .email({minDomainSegments: 2, tlds: {allow: ['com','net','edu','co'] } })

});

// funcion asincrona para crear un objeto de tipo de usuario 
async function crearUsuario(body){
    let usuario = new Usuario({
        email       : body.email,
        nombre      : body.nombre,
        password    : body.password,
        
    });
    return await usuario.save();
    
}

//Funcion asincrona para inactivar un usuario 

async function desactivarUsuario(email){
    let usuario = await Usuario.findOneAndUpdate({"email": email},{

        $set: {
            estado: false
        }

    }, {new: true});
    return usuario;

}

// funcion asincrona para listar todos los usuarios activos 
async function listarUsuariosActivos(){
    let usuarios = await Usuario.find({"estado": true });
    return usuarios;
}



    // Función asincrónica para actualizar un usuario 
async function actualizarUsuario(email, datos) {
    try {
        // Encuentra el usuario por su correo electrónico
        let usuario = await Usuario.findOne({ "email": email });

        // Verifica si el usuario existe
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        // Actualiza los campos del usuario con los nuevos datos
        if (datos.nombre) {
            usuario.nombre = datos.nombre;
        }
        if (datos.password) {
            usuario.password = datos.password;
        }
        if (datos.email) {
            usuario.email = datos.email;
        }


        // Guarda los cambios en la base de datos
        await usuario.save();

        // Retorna el usuario actualizado
        return usuario;
    } catch (error) {
        throw new Error("Error al actualizar el usuario: " + error.message);
    }
}


module.exports = {
    
    Schema,
    crearUsuario,
    actualizarUsuario,
    desactivarUsuario,
    listarUsuariosActivos
    
}