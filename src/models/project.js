const mongoose = require('mongoose');

//A la hora de definir el esquema podemos exigir que cumplan un requisito de tipo
//o que sean requeridos o dar valores por defecto
//Este esquema será usado cuando se interactue con la base de datos (en el tirectorio helpers)
var projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title cannot be blank!'
    },
    description: {
        type: String,
        required: 'Title cannot be blank!'
    },
    github: {
        type: String
    },
    website: {
        type: String
    },
    img: {
        type: String
    },
});

//Creo un modelo mongoose especificando el nombre del modelo, el modelo en si y el nombre
//de la colección que tendrá en Mongo (el nombre de la base la 'tabla')
var Project = mongoose.model('Project', projectSchema, 'project');

module.exports = Project;