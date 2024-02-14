export class ExpressError extends Error {
    statusCode: number; // Declare statusCode property

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

