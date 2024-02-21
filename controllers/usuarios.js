const express = require('express');
const Usuario = require('../models/usuario_model');
const ruta = express.Router();
const Joi = require('@hapi/joi'); 
const { join } = require('path');
const { json } = require('body-parser');

ruta.get('/', (req,res)=>{
    res.json('Respuesta a peticion GET de USUARIOS funcionando correctamente...');
    
    });

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
    password    : body.password
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
  











module.exports = ruta;  