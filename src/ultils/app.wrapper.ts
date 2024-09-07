export class ResponseWrapper<T> {
    data: T;
    message: string;
    code: number;

    constructor(data: T, message: string = "Success", code: number = 200) {
        this.data = data;
        this.message = message;
        this.code = code;
    }
}
