import { HttpStatus } from '@nestjs/common';

export class ResponseWrapper<T> {
    readonly statusCode: number;
    readonly message: string;
    readonly result: T;

    constructor(result: T, message: string = 'Success', statusCode: number = HttpStatus.OK) {
        this.statusCode = statusCode;
        this.message = message;
        this.result = result;
    }

    toResponse() {
        return {
            statusCode: this.statusCode,
            message: this.message,
            result: this.result,
        };
    }
}
