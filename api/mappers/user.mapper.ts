import { UserRoleEnum } from '../enums/user-role.enum';
import { DateTimeHelper } from '../helpers/date-time.helper';
import { User } from '../models/user';

export class UserMapper {
  
  /**
   * Map API User to App User
   */
  static toModel(user: any): User {
    // Handle both Firebase field names and model field names
    const id = user['id'] || user.id;
    const name = user['name'] || user.name;
    const email = user['email'] || user.email;
    const phone = user['phone'] || user.phone;
    const password = user['password'] || user.password;
    const birthDate = user['birth-date'] || user.birthDate;

    const gender = user['gender'] || user.gender;
    const relation = user['relation'] || user.relation;
    const role = user['role'] || user.role;

    const parentId = user['parent-id'] || user.parentId;
    const joinedDate = user['joined-date'] || user.joinedDate;
    const isActive = user['is-active'] !== undefined ? user['is-active'] : user.isActive;

    return {
      id: typeof id === 'string' ? parseInt(id) : id,
      name,
      email,
      phone,
      password,
      birthDate,
      gender,
      relation,
      role,
      parentId,
      joinedDate: joinedDate ? DateTimeHelper.toISOString(joinedDate) : null,
      isActive: isActive !== undefined ? isActive : true
    };
  }


  static toDbModel(user: User): any {
    const dbModel: any = {
      'id': user.id,
      'name': user.name,
      'email': user.email,
      'password': user.password,
      'gender': user.gender,
      'relation': user.relation,
      'role': user.role,
      'is-active': user.isActive
    };

    // Only add fields that are not undefined
    if (user.phone !== undefined) {
      dbModel['phone'] = user.phone;
    }
    
    if (user.birthDate !== undefined) {
      dbModel['birth-date'] = user.birthDate ? DateTimeHelper.toTimestamp(user.birthDate) : null;
    }
    
    if (user.joinedDate !== undefined) {
      dbModel['joined-date'] = user.joinedDate ? DateTimeHelper.toTimestamp(user.joinedDate) : null;
    }

    if (user.parentId !== undefined) {
      dbModel['parent-id'] = user.parentId;
    }

    return dbModel;
  }
}
