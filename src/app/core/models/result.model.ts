export class ResultModel<T> {
    isSuccess!: boolean;
    value?: T | undefined;
    isFailure!: boolean;
    errors?: string[] | undefined;
}