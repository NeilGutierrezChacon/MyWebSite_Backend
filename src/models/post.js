const mongoose = require('mongoose');

const encrypt = require("mongoose-encryption");


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

const Post = mongoose.model('Post', postSchema, 'post');

module.exports = Post;