import UserService from '../services/UserService.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Signup Controller
 * Creates a new user account
 * Returns success message (no auto-login per requirements)
 */
export const singupUser = async (request, response, next) => {
    try {
        const { username, name, email, password } = request.body;

        // Validate required fields
        if (!username || !password) {
            const error = new Error('Username and password are required');
            error.status = 400;
            throw error;
        }

        // Create user using UserService
        await UserService.createUser({
            username,
            name: name || username, // Use username as fallback for name
            email,
            password
        });

        return response.status(200).json({
            success: true,
            msg: 'Signup successful! Please login to continue.'
        });
    } catch (error) {
        next(error); // Pass error to error handler middleware
    }
};

/**
 * Login Controller
 * Authenticates user and returns JWT tokens
 * Accepts both username and email for login
 */
export const loginUser = async (request, response, next) => {
    try {
        const { username, password } = request.body;

        // Validate required fields
        if (!username || !password) {
            const error = new Error('Username/email and password are required');
            error.status = 400;
            throw error;
        }

        // Authenticate using UserService (supports both username and email)
        const authData = await UserService.authenticateUser(username, password);

        return response.status(200).json({
            success: true,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
            username: authData.username,
            name: authData.name,
            _id: authData._id
        });
    } catch (error) {
        next(error); // Pass error to error handler middleware
    }
};

/**
 * Logout Controller
 * Invalidates refresh token
 */
export const logoutUser = async (request, response, next) => {
    try {
        const token = request.body.token;

        if (!token) {
            const error = new Error('Token is required');
            error.status = 400;
            throw error;
        }

        await UserService.logoutUser(token);

        return response.status(200).json({
            success: true,
            msg: 'Logout successful'
        });
    } catch (error) {
        next(error); // Pass error to error handler middleware
    }
};