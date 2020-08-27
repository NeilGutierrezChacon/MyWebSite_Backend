const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');


const postSchema = new mongoose.Schema({
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

postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postSchema, 'post');

module.exports = Post;