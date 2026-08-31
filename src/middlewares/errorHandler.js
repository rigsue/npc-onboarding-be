export function errorHandler(err, req, res, next) {
    console.error(err);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        error: {
            message: err.message || "Internal Server Error",
            errorCode: err.code || "server_error",
            details: err.details
        }
    });
}