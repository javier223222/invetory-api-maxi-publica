export class HttpError extends Error{
    public readonly status:number;
    public readonly name:string;
    constructor(status:number,name:string,message:string){
        super(message)
        this.status=status;
        this.name=name
    }
}