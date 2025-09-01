import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { AppUrlGenerator } from "../helpers/app-url-generator";
import { Endpoints } from "../consts/endpoints";
import { QueryParamsModel } from "../../features/shared/models/query-params.model";
import { PagedList } from "../../features/shared/models/paged-list.model";


export class ApiService<T> {

    protected readonly appURLGenerator!: AppUrlGenerator;

    constructor(protected httpClient: HttpClient, protected resourceName: string) {
        this.appURLGenerator = new AppUrlGenerator(this.resourceName);
    }

    getAll(): Observable<T[]> {
        return this.httpClient.get<T[]>(this.appURLGenerator.getEndPointWithActionQuery(Endpoints.Generic.Actions.GetAll))
            .pipe(catchError(this.handleError));
    }

    getPaged(queryParams: QueryParamsModel): Observable<PagedList<T>> {
        const _queryParams = new HttpParams()
            .set('page', queryParams.page?.toString() || '1')
            .set('pageSize', queryParams.pageSize?.toString() || '10')
            .set('sortBy', queryParams.sort?.columnName || 'id')
            .set('sortOrder', queryParams.sort?.direction || 'desc');

        return this.httpClient.get<PagedList<T>>(this.appURLGenerator.getEndPointWithActionQuery(Endpoints.Generic.Actions.GetPaged + '&' + _queryParams.toString()))
            .pipe(catchError(this.handleError));
    }

    get(id: string | number): Observable<T> {
        return this.httpClient.get<T>(this.appURLGenerator.getEndPointWithActionQuery(Endpoints.Generic.Actions.Get(id)))
            .pipe(catchError(this.handleError));
    }

    add(resource: T): Observable<boolean> {
        return this.httpClient.post<boolean>(this.appURLGenerator.getEndPointWithActionQuery(Endpoints.Generic.Actions.Create), resource)
            .pipe(catchError(this.handleError));
    }

    delete(id: string | number): Observable<boolean> {
        return this.httpClient.delete<boolean>(this.appURLGenerator.getEndPointWithActionQuery(Endpoints.Generic.Actions.Delete(id)))
            .pipe(catchError(this.handleError));
    }

    update(resource: T): Observable<boolean> {
        return this.httpClient.put<boolean>(this.appURLGenerator.getEndPointWithActionQuery(Endpoints.Generic.Actions.Update), resource)
            .pipe(catchError(this.handleError));
    }


    activate(id: number): Observable<boolean> {
        return this.httpClient.get<boolean>(this.appURLGenerator.getEndPointWithActionQuery(Endpoints.Generic.Actions.Activate(id)))
            .pipe(catchError(this.handleError));
    }

    deactivate(id: number): Observable<boolean> {
        return this.httpClient.get<boolean>(this.appURLGenerator.getEndPointWithActionQuery(Endpoints.Generic.Actions.Deactivate(id)))
            .pipe(catchError(this.handleError));
    }

    protected handleError = (error: HttpErrorResponse) => throwError('Something wrong happened');
}