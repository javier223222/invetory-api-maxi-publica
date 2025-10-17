import { HttpError } from "./http-error";

export class UnauthorizedError extends HttpError {
    constructor(message: string = "Unauthorized", customMessage: string = "No autorizado") {
        super(401, "Unauthorized", message, customMessage);
    }
}