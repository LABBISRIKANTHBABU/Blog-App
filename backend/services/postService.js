/**
 * PostService - Blog Post Management Service
 * 
 * Demonstrates OOP Concepts:
 * 1. Inheritance: Extends BaseService to inherit common CRUD operations
 * 2. Polymorphism: Overrides and extends base methods with post-specific behavior
 * 3. Encapsulation: Encapsulates post-specific business logic
 */

import BaseService from './BaseService.js';
import Post from '../model/post.js';

class PostService extends BaseService {
    constructor() {
        super(Post);
    }

    /**
     * Create a new post
     * Demonstrates Polymorphism - Uses inherited create() method
     */
    async createPost(postData) {
        return await this.create(postData);
    }

    /**
     * Update a post
     * Demonstrates Polymorphism - Uses inherited update() method
     */
    async updatePost(id, postData) {
        return await this.update(id, postData);
    }

    /**
     * Delete a post
     * Demonstrates Polymorphism - Uses inherited delete() method
     */
    async deletePost(id) {
        return await this.delete(id);
    }

    /**
     * Get post by ID
     * Demonstrates Polymorphism - Uses inherited findById() method
     */
    async getPostById(id) {
        return await this.findById(id);
    }

    /**
     * Get all posts with optional filters and search
     * Demonstrates Polymorphism - Overrides base findAll() with custom logic
     * @param {String} username - Filter by username
     * @param {String} category - Filter by category
     * @param {String} search - Text search query
     * @returns {Promise<Array>} Array of posts
     */
    async getAllPosts(username, category, search) {
        let query = {};

        // Filter by username
        if (username) {
            query.username = username;
        }
        // Filter by category
        else if (category) {
            query.categories = category;
        }
        // Text search using MongoDB text index
        else if (search) {
            // Use text search if index exists, otherwise use regex fallback
            query.$text = { $search: search };
        }

        try {
            // If using text search, sort by relevance score
            if (search) {
                return await this.model
                    .find(query, { score: { $meta: 'textScore' } })
                    .sort({ score: { $meta: 'textScore' } });
            } else {
                return await this.findAll(query);
            }
        } catch (error) {
            // Fallback to regex search if text index doesn't exist
            if (error.code === 27 && search) {
                query = {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
                };
                return await this.findAll(query);
            }
            throw error;
        }
    }

    /**
     * Get posts by author
     * @param {String} username - Author username
     * @returns {Promise<Array>} Array of posts
     */
    async getPostsByAuthor(username) {
        return await this.findAll({ username });
    }

    /**
     * Get posts by category
     * @param {String} category - Category name
     * @returns {Promise<Array>} Array of posts
     */
    async getPostsByCategory(category) {
        return await this.findAll({ categories: category });
    }
}

// Export singleton instance
export default new PostService();
