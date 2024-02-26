const express = require('express');
const Curso = require('../models/curso_model');
const ruta = express.Router();

ruta.get('/', (req,res)=>{
res.json('Respuesta a peticion GET de CURSOS funcionando correctamente...');

});


//funcion asincrona para crear cursos 

async function crearCurso(body){
    let curso = new Curso({

        titulo      : body.titulo,
        descripcion : body.descripcion,
        alumnos     : body.alumnos,
        estado      : body.estado,
        calificacion: body.calificacion
    });
    return await curso.save();
}


//endpoint de tipo POST para el recurso CURSOS
ruta.post('/',(req,res) =>{
    let resultado = crearCurso(req.body);

    resultado.then(curso => {
        res.json({
            curso

        })
    }).catch(err => {
        res.status(400).json({
            err
        })
    })
});







module.exports = ruta;