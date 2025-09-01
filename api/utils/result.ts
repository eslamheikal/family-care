export class Result<T> {

    isSuccess!: boolean;
    value?: T | undefined;
    isFailure!: boolean;
    errors?: string[] | undefined;

    static success<G>(value: G): Result<G> {
        return { isSuccess: true, value: value, isFailure: false };
    }

    static failure<G>(errors: string[]): Result<G> {
        return { isFailure: true, errors: errors, isSuccess: false };
    }
    
}