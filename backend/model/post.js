import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: false
    },
    createdDate: {
        type: Date
    }
});

// Create text index for search functionality
// This enables MongoDB's text search on title and description
PostSchema.index({ title: 'text', description: 'text' });


const post = mongoose.model('post', PostSchema);

export default post;