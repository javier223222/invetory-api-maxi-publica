import { HttpError } from "./http-error";
export class BadRequestError extends HttpError{
    constructor (message:string="La solicitud es invalida"){
        super(400,"Bad Request",message)
    }
}