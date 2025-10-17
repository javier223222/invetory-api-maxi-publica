export interface ResponseSuccess<T> {
    status: number;
    message: string;
    data: T;

}
