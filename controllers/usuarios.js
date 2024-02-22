const express = require('express');
const Usuario = require('../models/usuario_model');
const ruta = express.Router();
const Joi = require('@hapi/joi'); 
const { join } = require('path');
const { json } = require('body-parser');
const usuario_model = require('../models/usuario_model');


// funcion asincrona para listar todos los usuarios activos 
async function listarUsuariosActivos(){
    let usuarios = await Usuario.find({"estado": true });
    return usuarios;
}

//endopoint de tipo GET  para el recurso usuarios.lista de todos los usuarios 

ruta.get('/',(req, res) => {
    let resultado = listarUsuariosActivos();
    resultado.then(usuarios => {
        res.json(usuarios)
    }).catch(err => {
        res.status(400).json(
            {
                err
            }
        )
    })
});


module.exports = ruta;  

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
.email({minDomainSegments: 2, tlds: {allow: ['com','net','edu','co']}})


});


// funcion asincrona para crear un objeto de tipo de usuario 

async function crearUsuario(body){
let usuario = new Usuario({

    email       : body.email,
    nombre      : body.nombre,
    password    : body.password,
    estado      :body.estado
});
return await usuario.save();

}

//endpoint de tipo POST para el recurso USUARIOS

ruta.post('/', (req , res) => {
    let body = req.body;

    const {error, value} = Schema.validate({nombre: body.nombre, email: body.email});
    if(!error){
     let resultado = crearUsuario(body);

     resultado.then( user => {
        res.json({
            valor: user
        })
     }).catch(err => {
        res.status(400).json({
            err
        })
     });


    }else{

        res.status(400).json({
            error
        })
    }
});
// estructura del PUT
async function actualizarUsuario(email, body){
let usuario = await Usuario.findOneAndUpdate({"email": email},{

$set:{
    nombre: body.nombre,
    password: body.password
}

},{new: true});
return usuario;

}
//endopoint de tipo PUT para actualizar los datos del usuario 

ruta.put('/:email',(req , res) => {


    const {error, value } = Schema.validate({nombre: req.body.nombre});
    if(!error){
let resultado = actualizarUsuario(req.params.email,req.body);
resultado.then(valor => {
    res.json({
        valor
    })
}).catch(err => {
    res.status(400).json({
        err
    })
});

} else{
    res.status(400).json({
        error
    })
 }

});
  

//Funcion asincrona para inactivar un usuario 

async function desactivarUsuario(email){
    let usuario = await Usuario.findOneAndUpdate({"email": email},{

$set: {
    estado: false

}

    },{new: true});
    return usuario;

}

//Endpoint de tipo DELETE  para el recurso Usuarios

ruta.delete('/:email',(req, res) =>{
let resultado = desactivarUsuario(req.params.email);
resultado.then(valor => {
    res.json({

        usuario: valor

    })
}).catch(err => {

    res.status(400).json({

        err
    })
});


});


module.exports = ruta;  