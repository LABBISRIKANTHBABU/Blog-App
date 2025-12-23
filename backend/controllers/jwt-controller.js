import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Token from '../model/token.js';
import UserService from '../services/UserService.js';

dotenv.config();

export const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    console.log('Received Auth Header:', authHeader); // DEBUG LOG
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted Token:', token); // DEBUG LOG

    if (token == null) {
        return response.status(401).json({ msg: 'token is missing' });
    }

    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (error, user) => {
        if (error) {
            console.error('JWT Verification Error:', error.message);
            return response.status(403).json({ msg: `invalid token: ${error.message}` })
        }

        request.user = user;
        next();
    })
}

export const createNewToken = async (request, response, next) => {
    try {
        const refreshToken = request.body.token.split(' ')[1];

        if (!refreshToken) {
            const error = new Error('Refresh token is missing');
            error.status = 401;
            throw error;
        }

        // Use UserService to refresh access token
        const accessToken = await UserService.refreshAccessToken(refreshToken);

        return response.status(200).json({
            success: true,
            accessToken: accessToken
        });
    } catch (error) {
        next(error); // Pass to error handler middleware
    }
}