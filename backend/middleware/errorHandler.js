const errorHandler = (err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    
    const status = err.status || 500;
    const message = err.message || 'An unexpected error occurred.';

    res.status(status).json({
        success: false,
        message: message,
    });
};

module.exports = errorHandler;