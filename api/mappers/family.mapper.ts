import { UserRoleEnum } from '../enums/user-role.enum';
import { DateTimeHelper } from '../helpers/date-time.helper';
import { Family } from '../models/family.model';

export class FamilyMapper {
  
  /**
   * Map API Family to App Family
   */
  static toModel(family: any): Family {
    // Handle both Firebase field names and model field names
    const id = family['id'] || family.id;
    const joinedDate = family['joined-date'] || family.joinedDate;
    const isActive = family['is-active'] !== undefined ? family['is-active'] : family.isActive;

    return {
      id: typeof id === 'string' ? parseInt(id) : id,
      joinedDate: joinedDate ? DateTimeHelper.toISOString(joinedDate) : null,
      isActive: isActive !== undefined ? isActive : true
    };
  }


  static toDbModel(family: Family): any {
    return {
      'id': family.id,
      'joined-date': family.joinedDate ? DateTimeHelper.toTimestamp(family.joinedDate) : null,
      'is-active': family.isActive
    };
  }
}
