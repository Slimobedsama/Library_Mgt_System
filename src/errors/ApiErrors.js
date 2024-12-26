export default class ApiErrors {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
    static badRequest(message) {
        return new ApiErrors(400, message);
    }
    static notFound(message) {
        return new ApiErrors(404, message);
    }
    static internalServer(message) {
        return new ApiErrors(500, message);
    }
}