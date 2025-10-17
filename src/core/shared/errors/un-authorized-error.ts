import { HttpError } from "./http-error";
export class UnauthorizedError extends HttpError{
    constructor(message:string="No autorizado"){
        super(401,"Unathorized",message)
    }
}