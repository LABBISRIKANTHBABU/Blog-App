import PostService from '../services/postService.js';
import ExportService from '../services/exportService.js';
import mongoose from 'mongoose';

export const createPost = async (request, response, next) => {
    try {
        const post = await PostService.createPost(request.body);
        response.status(200).json({
            success: true,
            msg: 'Post created successfully',
            data: post
        });
    } catch (error) {
        if (error.code === 11000) {
            error.message = 'Title already exists. Please choose a different title.';
            error.status = 400;
        }
        next(error);
    }
}

export const updatePost = async (request, response, next) => {
    try {
        const post = await PostService.getPostById(request.params.id);

        if (!post) {
            const error = new Error('Post not found');
            error.status = 404;
            throw error;
        }

        // Ownership Check
        if (post.username !== request.user.username) {
            const error = new Error('You are not authorized to update this post');
            error.status = 403;
            throw error;
        }

        await PostService.updatePost(request.params.id, request.body);

        response.status(200).json({
            success: true,
            msg: 'Post updated successfully'
        });
    } catch (error) {
        next(error);
    }
}

export const deletePost = async (request, response, next) => {
    try {
        const post = await PostService.getPostById(request.params.id);

        if (!post) {
            const error = new Error('Post not found');
            error.status = 404;
            throw error;
        }

        // Ownership Check
        if (post.username !== request.user.username) {
            const error = new Error('You are not authorized to delete this post');
            error.status = 403;
            throw error;
        }

        await PostService.deletePost(request.params.id);

        response.status(200).json({
            success: true,
            msg: 'Post deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const getPost = async (request, response, next) => {
    try {
        const { id } = request.params;

        // 1️⃣ Check valid MongoDB ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const error = new Error('Invalid post ID format');
            error.status = 400;
            throw error;
        }

        // 2️⃣ Find post
        const post = await PostService.getPostById(id);

        // 3️⃣ If post not found
        if (!post) {
            const error = new Error('Post not found');
            error.status = 404;
            throw error;
        }

        // 4️⃣ Success
        response.status(200).json({
            success: true,
            data: post
        });

    } catch (error) {
        next(error);
    }
};


export const getAllPosts = async (request, response, next) => {
    try {
        let username = request.query.username;
        let category = request.query.category;
        let search = request.query.search;

        const posts = await PostService.getAllPosts(username, category, search);

        response.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        next(error);
    }
}

export const exportExcel = async (request, response, next) => {
    try {
        const posts = await PostService.getAllPosts();
        const buffer = await ExportService.exportToExcel(posts);

        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=blog_posts.xlsx');

        response.send(buffer);
    } catch (error) {
        next(error);
    }
}

export const exportWord = async (request, response, next) => {
    try {
        const { id } = request.params;
        const post = await PostService.getPostById(id);

        if (!post) {
            const error = new Error('Post not found for export');
            error.status = 404;
            throw error;
        }

        const buffer = await ExportService.exportToWord(post);

        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        response.setHeader('Content-Disposition', `attachment; filename=${post.title}.docx`);

        response.send(buffer);
    } catch (error) {
        next(error);
    }
}
