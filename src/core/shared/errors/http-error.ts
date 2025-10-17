export class HttpError extends Error {
    public readonly status: number;
    public readonly name: string;
    public readonly customMessage: string;

    constructor(status: number, name: string, message: string, customMessage: string) {
        super(message);
        this.status = status;
        this.name = name;
        this.customMessage = customMessage;
    }
}