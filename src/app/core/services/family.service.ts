import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Family } from '../models/family.model';
import { QueryParamsModel } from '../../features/shared/models/query-params.model';
import { Observable, of } from 'rxjs';
import { PagedList } from '../../features/shared/models/paged-list.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class FamilyService extends ApiService<Family> {

  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.FAMILIES.Controller);
  }


  override getPaged(params: QueryParamsModel): Observable<PagedList<Family>> {

    return of({
      items: [
        {
          id: 1,
          name: 'Family 1',
          membersNumber: 1,
          joinedDate: new Date(),
          isActive: true,
        } as unknown as Family,
      ],
      totalCount: 0,
      pageCount: 1,
    } as PagedList<Family>);

  }
 
}