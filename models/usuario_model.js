const mongoose = require('mongose'); 

const usuarioSchema = new mongoose.usuarioSchema({
    email:{
        type:String,
        require: true
    },
    nombre:{
        type:String,
        require: true
    },
    password:{
        type:String,
        require: true
    },
    estado:{
        type:Boolean,
        require: true
    },
    imagen:{
        type:String,
        require: false
    }

});

module.exports = mongoose.model('Usuario',usuarioSchema);