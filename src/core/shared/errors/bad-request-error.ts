import { HttpError } from "./http-error";

export class BadRequestError extends HttpError {
    constructor(message: string = "The request is invalid", customMessage: string = "La solicitud es inválida") {
        super(400, "Bad Request", message, customMessage);
    }
}