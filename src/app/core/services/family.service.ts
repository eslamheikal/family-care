import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Endpoints } from '../consts/endpoints';
import { Family } from '../models/family.model';
import { QueryParamsModel } from '../../features/shared/models/query-params.model';
import { Observable, of } from 'rxjs';
import { PagedList } from '../../features/shared/models/paged-list.model';
import { FamilyMember } from '../models/family-member.model';
import { GenderEnum } from '../enums/gender.enum';
import { UserRoleEnum } from '../enums/user-role.enum';
import { FamilyRelation } from '../enums/family.relation.enum';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class FamilyService extends ApiService<Family> {

  constructor(httpClient: HttpClient) {
    super(httpClient, Endpoints.FAMILIES.Controller);
  }

  
  private readonly familyMembers: FamilyMember[] = [
    {
      id: 1,
      name: 'Ahmed Al-Rashid',
      gender: GenderEnum.Male,
      birthDate: '1980-05-20',
      phoneNumber: '+966501234567',
      email: 'ahmed.alrashid@email.com',
      password: 'password123',
      isActive: true,
      role: UserRoleEnum.FamilyParent,
      relation: FamilyRelation.Father
    },
    {
      id: 2,
      name: 'Fatima Al-Zahra',
      gender: GenderEnum.Female,
      birthDate: '1985-08-12',
      phoneNumber: '+966507654321',
      email: 'fatima.alzahra@email.com',
      password: 'password123',
      isActive: true,
      role: UserRoleEnum.FamilyParent,
      relation: FamilyRelation.Mother
    },
    {
      id: 3,
      name: 'Omar Al-Mansouri',
      gender: GenderEnum.Male,
      birthDate: '1978-12-03',
      phoneNumber: '+966509876543',
      email: 'omar.almansouri@email.com',
      password: 'password123',
      isActive: true,
      role: UserRoleEnum.FamilyParent,
      relation: FamilyRelation.Son
    }
  ];

  private readonly families: Family[] = [
    {
      id: 1,
      code: 'FAM001',
      joinedDate: '2023-01-15',
      isActive: true,
      membersNumber: 4,
      familyName: 'Al-Rashid Family',
      familyResponsible: {
        id: 1,
        name: 'Ahmed Al-Rashid',
        gender: GenderEnum.Male,
        birthDate: '1980-05-20',
        phoneNumber: '+966501234567',
        email: 'ahmed.alrashid@email.com',
        password: 'password123',
        isActive: true,
        role: UserRoleEnum.FamilyParent,
        relation: FamilyRelation.Father
      },
      familyMembers: this.familyMembers
    },
    {
      id: 2,
      code: 'FAM002',
      joinedDate: '2023-03-22',
      isActive: true,
      membersNumber: 3,
      familyName: 'Al-Zahra Family',
      familyResponsible: {
        id: 2,
        name: 'Fatima Al-Zahra',
        gender: GenderEnum.Female,
        birthDate: '1985-08-12',
        phoneNumber: '+966507654321',
        email: 'fatima.alzahra@email.com',
        password: 'password123',
        isActive: true,
        role: UserRoleEnum.FamilyParent,
        relation: FamilyRelation.Mother
      },
      familyMembers: this.familyMembers
    },
    {
      id: 3,
      code: 'FAM003',
      joinedDate: '2023-06-10',
      isActive: true,
      membersNumber: 5,
      familyName: 'Al-Mansouri Family',
      familyResponsible: {
        id: 3,
        name: 'Omar Al-Mansouri',
        gender: GenderEnum.Male,
        birthDate: '1978-12-03',
        phoneNumber: '+966509876543',
        email: 'omar.almansouri@email.com',
        password: 'password123',
        isActive: true,
        role: UserRoleEnum.FamilyParent,
        relation: FamilyRelation.Son
      },
      familyMembers: this.familyMembers
    }
  ];


  override get(id: string | number): Observable<Family> {
    return of(this.families.find(f => f.id === id) as Family);
  }

  override getPaged(params: QueryParamsModel): Observable<PagedList<Family>> {

    return of({
      items: this.families,
      totalCount: 0,
      pageCount: 1,
    } as PagedList<Family>);

  }
 
}