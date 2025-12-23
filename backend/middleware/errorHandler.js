/**
 * Global Error Handler Middleware
 * 
 * Centralized error handling for the entire application.
 * Handles MongoDB errors, JWT errors, validation errors, and custom errors.
 */

/**
 * Error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    // Default error status and message
    let status = err.status || err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = null;

    // MongoDB Validation Error
    if (err.name === 'ValidationError') {
        status = 400;
        message = 'Validation Error';
        errors = Object.values(err.errors).map(e => ({
            field: e.path,
            message: e.message
        }));
    }

    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
        status = 400;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    }

    // MongoDB Cast Error (Invalid ObjectId)
    if (err.name === 'CastError') {
        status = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        status = 401;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        status = 401;
        message = 'Token expired';
    }

    // Send error response
    const response = {
        success: false,
        msg: message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };

    res.status(status).json(response);
};

export default errorHandler;
