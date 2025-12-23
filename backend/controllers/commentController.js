
import Comment from '../model/comment.js';


export const newComment = async (request, response) => {
    try {
        const comment = await new Comment(request.body);
        comment.save();

        response.status(200).json('Comment saved successfully');
    } catch (error) {
        response.status(500).json(error);
    }
}


export const getComments = async (request, response) => {
    try {
        const comments = await Comment.find({ postId: request.params.id });
        
        response.status(200).json(comments);
    } catch (error) {
        response.status(500).json(error)
    }
}

import mongoose from 'mongoose';

export const deleteComment = async (request, response) => {
    try {
        const { id } = request.params;

        // 1️⃣ Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).json({ msg: 'Invalid comment ID' });
        }

        // 2️⃣ Check if comment exists
        const comment = await Comment.findById(id);

        if (!comment) {
            return response.status(404).json({ msg: 'Comment not found' });
        }

        // 3️⃣ Delete safely
        await Comment.findByIdAndDelete(id);

        response.status(200).json('comment deleted successfully');

    } catch (error) {
        console.error(error);
        response.status(500).json({ msg: 'Error deleting comment' });
    }
};
