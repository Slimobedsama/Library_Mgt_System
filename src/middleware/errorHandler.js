import ApiErrors from "../errors/ApiErrors.js";

function errorHandler(err, req, res, next) {
    if (err instanceof ApiErrors) {
        console.error(err);
        return res.status(err.code).json({ message: err.message });
    }
    res.status(500).json({ message: err.message })
}

export default errorHandler;