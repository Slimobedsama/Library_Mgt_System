import ApiErrors from "../errors/ApiErrors.js";
import logger from "../logger.js";

function errorHandler(err, req, res, next) {
    if (err instanceof ApiErrors) {
        logger.error(`ApiError { code: ${err.code}, message: ${err.message} }`);
        return res.status(err.code).json({ message: err.message });
    }
    res.status(500).json({ message: err.message })
}

export default errorHandler;