import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { AppUrlGenerator } from "../helpers/app-url-generator";
import { ApiEndpoints } from "../consts/api-endpoints";
import { QueryParamsModel } from "../../features/shared/models/query-params.model";
import { PagedList } from "../../features/shared/models/paged-list.model";


export class ApiService<T> {

    protected readonly appURLGenerator!: AppUrlGenerator;

    constructor(protected httpClient: HttpClient, protected resourceName: string) {
        this.appURLGenerator = new AppUrlGenerator(this.resourceName);
    }

    getAll(): Observable<T[]> {
        return this.httpClient.get<T[]>(this.appURLGenerator.getEndPoint(ApiEndpoints.Generic.Actions.GetAll))
            .pipe(catchError(this.handleError));
    }

    getPaged(queryParams: QueryParamsModel): Observable<PagedList<T>> {
        return this.httpClient.post<PagedList<T>>(this.appURLGenerator.getEndPoint(ApiEndpoints.Generic.Actions.GetPaged), queryParams)
            .pipe(catchError(this.handleError));
    }

    get(id: string | number): Observable<T> {
        return this.httpClient.get<T>(this.appURLGenerator.getEndPoint(ApiEndpoints.Generic.Actions.Get(id)))
            .pipe(catchError(this.handleError));
    }

    add(resource: T): Observable<boolean> {
        return this.httpClient.post<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.Generic.Actions.Create), resource)
            .pipe(catchError(this.handleError));
    }

    delete(id: string | number): Observable<boolean> {
        return this.httpClient.delete<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.Generic.Actions.Delete(id)))
            .pipe(catchError(this.handleError));
    }

    update(resource: T): Observable<boolean> {
        return this.httpClient.put<boolean>(this.appURLGenerator.getEndPoint(ApiEndpoints.Generic.Actions.Update), resource)
            .pipe(catchError(this.handleError));
    }

    protected handleError = (error: HttpErrorResponse) => throwError('Something wrong happened');
}