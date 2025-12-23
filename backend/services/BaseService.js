/**
 * BaseService - Abstract Base Class for Service Layer
 * 
 * Demonstrates OOP Concepts:
 * 1. Abstraction: Provides common CRUD interface hiding implementation details
 * 2. Inheritance: Can be extended by specific services (UserService, PostService)
 * 3. Encapsulation: Encapsulates database operations
 * 4. Polymorphism: Allows child classes to override methods with custom behavior
 */

class BaseService {
    constructor(model) {
        if (new.target === BaseService) {
            throw new TypeError('Cannot construct BaseService instances directly');
        }
        this.model = model;
    }

    /**
     * Create a new document
     * @param {Object} data - Document data
     * @returns {Promise<Object>} Created document
     */
    async create(data) {
        const document = new this.model(data);
        return await document.save();
    }

    /**
     * Find document by ID
     * @param {String} id - Document ID
     * @returns {Promise<Object|null>} Found document or null
     */
    async findById(id) {
        return await this.model.findById(id);
    }

    /**
     * Find one document by query
     * @param {Object} query - Search query
     * @returns {Promise<Object|null>} Found document or null
     */
    async findOne(query) {
        return await this.model.findOne(query);
    }

    /**
     * Find all documents by query
     * @param {Object} query - Search query
     * @returns {Promise<Array>} Array of documents
     */
    async findAll(query = {}) {
        return await this.model.find(query);
    }

    /**
     * Update document by ID
     * @param {String} id - Document ID
     * @param {Object} data - Update data
     * @returns {Promise<Object|null>} Updated document
     */
    async update(id, data) {
        return await this.model.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );
    }

    /**
     * Delete document by ID
     * @param {String} id - Document ID
     * @returns {Promise<Object|null>} Deleted document
     */
    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }

    /**
     * Count documents matching query
     * @param {Object} query - Search query
     * @returns {Promise<Number>} Count of documents
     */
    async count(query = {}) {
        return await this.model.countDocuments(query);
    }

    /**
     * Check if document exists
     * @param {Object} query - Search query
     * @returns {Promise<Boolean>} True if exists, false otherwise
     */
    async exists(query) {
        const count = await this.count(query);
        return count > 0;
    }
}

export default BaseService;
