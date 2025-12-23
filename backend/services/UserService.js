/**
 * UserService - User Management Service
 * 
 * Demonstrates OOP Concepts:
 * 1. Inheritance: Extends BaseService to inherit common CRUD operations
 * 2. Encapsulation: Encapsulates user-specific business logic
 * 3. Abstraction: Abstracts user operations from controllers
 * 4. Polymorphism: Overrides base methods with user-specific behavior
 */

import BaseService from './BaseService.js';
import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Token from '../model/token.js';

class UserService extends BaseService {
    constructor() {
        super(User);
    }

    /**
     * Create a new user with hashed password
     * Demonstrates Polymorphism - Overrides base create() method
     * @param {Object} userData - User data (username, name, email, password)
     * @returns {Promise<Object>} Created user (without password)
     */
    async createUser(userData) {
        // Check if username already exists
        const existingUsername = await this.exists({ username: userData.username });
        if (existingUsername) {
            const error = new Error('Username already exists');
            error.status = 400;
            throw error;
        }

        // Check if email already exists
        if (userData.email) {
            const existingEmail = await this.exists({ email: userData.email });
            if (existingEmail) {
                const error = new Error('Email already exists');
                error.status = 400;
                throw error;
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create user with hashed password
        const user = await this.create({
            username: userData.username,
            name: userData.name,
            email: userData.email,
            password: hashedPassword
        });

        // Return user without password
        return this._sanitizeUser(user);
    }

    /**
     * Authenticate user and generate tokens
     * @param {String} usernameOrEmail - Username or email
     * @param {String} password - Plain text password
     * @returns {Promise<Object>} Access token, refresh token, and user data
     */
    async authenticateUser(usernameOrEmail, password) {
        // Find user by username or email
        const user = await this.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });

        if (!user) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.status = 401;
            throw error;
        }

        // Generate tokens
        const accessToken = this._generateAccessToken(user);
        const refreshToken = this._generateRefreshToken(user);

        // Save refresh token to database
        await this._saveRefreshToken(refreshToken);

        return {
            accessToken,
            refreshToken,
            username: user.username,
            name: user.name,
            _id: user._id
        };
    }

    /**
     * Logout user by removing refresh token
     * @param {String} refreshToken - Refresh token to invalidate
     */
    async logoutUser(refreshToken) {
        await Token.deleteOne({ token: refreshToken });
    }

    /**
     * Generate new access token from refresh token
     * @param {String} refreshToken - Valid refresh token
     * @returns {Promise<String>} New access token
     */
    async refreshAccessToken(refreshToken) {
        // Verify token exists in database
        const tokenDoc = await Token.findOne({ token: refreshToken });
        if (!tokenDoc) {
            const error = new Error('Invalid refresh token');
            error.status = 404;
            throw error;
        }

        // Verify token is valid
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
            const accessToken = this._generateAccessToken(decoded);
            return accessToken;
        } catch (err) {
            const error = new Error('Invalid or expired refresh token');
            error.status = 403;
            throw error;
        }
    }

    /**
     * Private: Generate access token
     * Demonstrates Encapsulation - Private helper method
     */
    _generateAccessToken(user) {
        return jwt.sign(
            {
                _id: user._id,
                username: user.username,
                name: user.name
            },
            process.env.ACCESS_SECRET_KEY,
            { expiresIn: '15m' }
        );
    }

    /**
     * Private: Generate refresh token
     * Demonstrates Encapsulation - Private helper method
     */
    _generateRefreshToken(user) {
        return jwt.sign(
            {
                _id: user._id,
                username: user.username,
                name: user.name
            },
            process.env.REFRESH_SECRET_KEY
        );
    }

    /**
     * Private: Save refresh token to database
     * Demonstrates Encapsulation - Private helper method
     */
    async _saveRefreshToken(refreshToken) {
        const tokenDoc = new Token({ token: refreshToken });
        await tokenDoc.save();
    }

    /**
     * Private: Remove password from user object
     * Demonstrates Encapsulation - Private helper method
     */
    _sanitizeUser(user) {
        const userObj = user.toObject ? user.toObject() : user;
        delete userObj.password;
        return userObj;
    }
}

// Export singleton instance
export default new UserService();
