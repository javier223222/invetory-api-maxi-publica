import { HttpError } from "./http-error";

export class NotFoundError extends HttpError {
    constructor(message: string = "Resource not found", customMessage: string = "El recurso no fue encontrado") {
        super(404, "Not Found", message, customMessage);
    }
}