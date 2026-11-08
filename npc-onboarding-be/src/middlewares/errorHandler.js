export function errorHandler(err, _req, res, _next) {
    console.error(err);

    const statusCode = err.status || 500;

    res.status(statusCode).json({
        error: {
            message: 
                statusCode === 500
                    ? "Internal Server Error"
                    : err.message || "Request failed",

            errorCode: 
                err.code || "internal_server_error",

            details: 
                statusCode === 500
                ? undefined
                : err.details
        }
    });
}