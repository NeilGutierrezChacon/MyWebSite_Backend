const mongoose = require("mongoose");

const mongoosePaginate = require('mongoose-paginate-v2');

const projectSchema = new mongoose.Schema({
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

projectSchema.plugin(mongoosePaginate);

const Project = mongoose.model("Project", projectSchema, "project");

module.exports = Project;
