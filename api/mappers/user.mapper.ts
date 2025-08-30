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
    return {
      'id': user.id,
      'name': user.name,
      'email': user.email,
      'phone': user.phone,
      'password': user.password,
      'birth-date': user.birthDate ? DateTimeHelper.toTimestamp(user.birthDate) : null,

      'gender': user.gender,
      'relation': user.relation,
      'role': user.role,
      
      'parent-id': user.parentId,
      'joined-date': user.joinedDate ? DateTimeHelper.toTimestamp(user.joinedDate) : null,
      'is-active': user.isActive
    };
  }
}
