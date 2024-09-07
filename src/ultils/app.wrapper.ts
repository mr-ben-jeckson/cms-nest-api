export class ResponseWrapper<T> {
    data: T;
    message: string;
    statusCode: number;

    constructor(data: T, message: string = "Success", statusCode: number = 200) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }
}
