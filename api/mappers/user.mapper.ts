import { UserRoleEnum } from '../enums/user-role.enum';
import { DateTimeHelper } from '../helpers/date-time.helper';
import { DB_TABLES } from '../lib/db-tables.const';
import { User } from '../models/user';

export class UserMapper {
  
  /**
   * Map API User to App User
   */
  static toModel(user: any): User {
    // Handle both Firebase field names and model field names
    const id = user[DB_TABLES.USERS.ID] || user.id;
    const name = user[DB_TABLES.USERS.NAME] || user.name;
    const email = user[DB_TABLES.USERS.EMAIL] || user.email;
    const phone = user[DB_TABLES.USERS.PHONE] || user.phone;
    const password = user[DB_TABLES.USERS.PASSWORD] || user.password;
    const birthDate = DateTimeHelper.toISOString(user[DB_TABLES.USERS.BIRTH_DATE]) || user.birthDate;

    const gender = user[DB_TABLES.USERS.GENDER] || user.gender;
    const relation = user[DB_TABLES.USERS.RELATION] || user.relation;
    const role = user[DB_TABLES.USERS.ROLE] || user.role;

    const parentId = user[DB_TABLES.USERS.PARENT_ID] || user.parentId;
    const joinedDate = user[DB_TABLES.USERS.JOINED_DATE] || user.joinedDate;
    const isActive = user[DB_TABLES.USERS.IS_ACTIVE] !== undefined ? user[DB_TABLES.USERS.IS_ACTIVE] : user.isActive;

    return {
      id: typeof id === 'string' ? parseInt(id) : id,
      name,
      email,  
      phone,
      password: '********',
      birthDate: birthDate,
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
      [DB_TABLES.USERS.ID]: user.id,
      [DB_TABLES.USERS.NAME]: user.name,
      [DB_TABLES.USERS.EMAIL]: user.email,
      [DB_TABLES.USERS.PASSWORD]: user.password,
      [DB_TABLES.USERS.GENDER]: user.gender,
      [DB_TABLES.USERS.RELATION]: user.relation,
      [DB_TABLES.USERS.ROLE]: user.role,
      [DB_TABLES.USERS.IS_ACTIVE]: user.isActive
    };

    // Only add fields that are not undefined
    if (user.phone !== undefined) {
      dbModel[DB_TABLES.USERS.PHONE] = user.phone;
    }
    
    if (user.birthDate !== undefined) {
      dbModel[DB_TABLES.USERS.BIRTH_DATE] = user.birthDate ? DateTimeHelper.toTimestamp(user.birthDate) : null;
    }
    
    if (user.joinedDate !== undefined) {
      dbModel[DB_TABLES.USERS.JOINED_DATE] = user.joinedDate ? DateTimeHelper.toTimestamp(user.joinedDate) : null;
    }

    if (user.parentId !== undefined) {
      dbModel[DB_TABLES.USERS.PARENT_ID] = user.parentId;
    }

    return dbModel;
  }
}
