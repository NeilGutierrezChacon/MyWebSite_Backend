const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
//A la hora de definir el esquema podemos exigir que cumplan un requisito de tipo
//o que sean requeridos o dar valores por defecto
//Este esquema será usado cuando se interactue con la base de datos (en el tirectorio helpers)
var projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Title cannot be blank!",
  },
  description: {
    type: String,
    required: "Description cannot be blank!",
  },
  github: {
    type: String,
  },
  website: {
    type: String,
  },
  img: {
    type: String,
  },
  imgs: {
    type: Array,
  },
  imgPublicId: {
    type: String,
  },
  imgsPubId: {
    type: Array,
  },
  updateDate: {
    type: Date,
    required: 'Date cannot be blank'
  },
});

/* let encKey= process.env.MONGOOSE_ENC_KEY;
let sigKey= process.env.MONGOOSE_SIG_KEY;

projectSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey }); */

//Creo un modelo mongoose especificando el nombre del modelo, el modelo en si y el nombre
//de la colección que tendrá en Mongo (el nombre de la base la 'tabla')
var Project = mongoose.model("Project", projectSchema, "project");

module.exports = Project;
