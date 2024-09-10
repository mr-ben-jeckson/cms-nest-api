import { HttpStatus } from '@nestjs/common';

export class ResponseWrapper<T> {
    result: T;
    message: string;
    statusCode: number;

    constructor(result: T, message: string = "Success", statusCode: number = HttpStatus.OK) {
        this.result = result;
        this.message = message;
        this.statusCode = statusCode;
    }

    toResponse() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            result: this.result,
        };
    }
}
