const mongoose = require('mongoose');

//A la hora de definir el esquema podemos exigir que cumplan un requisito de tipo
//o que sean requeridos o dar valores por defecto
//Este esquema será usado cuando se interactue con la base de datos (en el tirectorio helpers)
var postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title cannot be blank!'
    },
    updateDate: {
        type: Date,
        required: 'Date cannot be blank'
    },
    summary: {
        type: String,
        required: 'Summary cannot be blank!'
    },
    introduction: {
        type: String,
        required: 'Introduction cannot be blank!'
    },
    body: {
        type: String,
        required: 'Body cannot be blank!'
    },
    conclusion: {
        type: String,
        required: 'Conclusion cannot be blank!'
    },
});

//Creo un modelo mongoose especificando el nombre del modelo, el modelo en si y el nombre
//de la colección que tendrá en Mongo (el nombre de la base la 'tabla')
const Post = mongoose.model('Post', postSchema, 'post');

module.exports = Post;