const mongoose = require("mongoose");

const mongoosePaginate = require('mongoose-paginate-v2');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Title cannot be blank!",
  },
  content: {
    type: String,
  },
  github: {
    type: String,
  },
  website: {
    type: String,
  },
  outstandingImage:{
    type: String
  },
  outstandingImagePubId:{
    type: String
  },
  imgs: {
    type: Array,
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
