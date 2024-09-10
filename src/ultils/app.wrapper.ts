import { HttpStatus } from '@nestjs/common';

export class ResponseWrapper<T> {
    data: T;
    message: string;
    statusCode: number;

    constructor(data: T, message: string = "Success", statusCode: number = HttpStatus.OK) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }

    toResponse() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            data: this.data,
        };
    }
}
