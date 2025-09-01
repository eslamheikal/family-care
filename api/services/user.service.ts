import { DbQueries } from "../lib/db-queries";
import { User } from "../models/user";
import { UserMapper } from "../mappers/user.mapper";
import { UserRoleEnum } from "../enums/user-role.enum";
import { Result } from "../utils/result";
import { PagedList } from "../utils/paged-list.model";
import { QueryParamsModel } from "../utils/query-params.model";
import { DbCommands } from "../lib/db-commands";
import { DB_TABLES } from "../lib/db-tables.const";
import { DbBuilder } from "../lib/db-builder";

const userCommands = new DbCommands('users', 'id');
const userQueries = new DbQueries('users', 'id');

export class UserService {

  async getFamilyParents(): Promise<Result<User[]>> {
    const users = await userQueries.query({ where: { role: UserRoleEnum.Parent } });
    return Result.success(users.map(user => UserMapper.toModel(user)));
  }

  async getFamilyMembers(userId: number): Promise<Result<User[]>> {

    const whereClause = DbBuilder.or(
      DbBuilder.and(DbBuilder.condition(DB_TABLES.USERS.PARENT_ID, '==', userId)),
      DbBuilder.and(DbBuilder.condition(DB_TABLES.USERS.ID, '==', userId))
    );

    const users = await userQueries.query({ where: whereClause });
    return Result.success(users.map(user => UserMapper.toModel(user)));
  }

  async getUsersPaged(options: QueryParamsModel): Promise<PagedList<User>> {
    const pagedList = await userQueries.getPaged(options);

    return {
      items: pagedList.items.map(user => UserMapper.toModel(user)),
      totalCount: pagedList.totalCount,
      pageCount: pagedList.pageCount
    };
  }

  async getUser(userId: number, currentUserId: number, currentUserRole: UserRoleEnum, currentParentId: number): Promise<Result<User>> {
    const user = await userQueries.getById(userId);

    if (!user) {
      return Result.failure(['User not found']);
    }

    const mappedUser = UserMapper.toModel(user);

    const canAccessUser = await this.canAccessUser(mappedUser, currentUserId, currentUserRole, currentParentId);
    if (!canAccessUser.isSuccess) {
      return Result.failure(canAccessUser.errors!);
    }

    return Result.success(mappedUser);
  }

  async addUser(user: User): Promise<Result<User>> {

    // check if user already exists by email or phone
    const hasDuplicate = await this.hasDuplicate(user);
    if (!hasDuplicate.isSuccess) {
      return hasDuplicate;
    }

    await userCommands.create(UserMapper.toDbModel(user!));
    return Result.success(user);
  }

  async updateUser(updateData: User): Promise<Result<User>> {
    // check if user already exists by email or phone
    const hasDuplicate = await this.hasDuplicate(updateData);
    if (!hasDuplicate.isSuccess) {
      return hasDuplicate;
    }

    const updatedUser = await userCommands.update(updateData.id, UserMapper.toDbModel(updateData));
    return updatedUser ? Result.success(UserMapper.toModel(updatedUser)) : Result.failure(['User not found']);
  }

  async activateUser(userId: number): Promise<Result<boolean>> {
    const result = await userCommands.update(userId, { [DB_TABLES.USERS.IS_ACTIVE]: true });
    return result ? Result.success(true) : Result.failure(['User not found']);
  }

  async deactivateUser(userId: number): Promise<Result<boolean>> {
    const result = await userCommands.update(userId, { [DB_TABLES.USERS.IS_ACTIVE]: false });
    return result ? Result.success(true) : Result.failure(['User not found']);
  }

  async deleteUser(userId: number): Promise<Result<boolean>> {
    const result = await userCommands.delete(userId);
    return result ? Result.success(true) : Result.failure(['User not found']);
  }

  async hasDuplicate(user: User): Promise<Result<User>> {

    // check if user already exists by email or phone
    const userExists = await userQueries.query({ where: { email: user.email, phone: user.phone } });

    if (userExists.length > 0 && userExists[0].email === user.email && +userExists[0].id !== user.id) {
      return Result.failure(['User already exists with this email']);
    }

    if (userExists.length > 0 && userExists[0].phone === user.phone && +userExists[0].id !== user.id) {
      return Result.failure(['User already exists with this phone']);
    }

    return Result.success(userExists[0]);
  }

  async canAccessUser(user: User, currentUserId: number, currentUserRole: UserRoleEnum, currentParentId: number): Promise<Result<boolean>> {
    
    if (currentUserRole === UserRoleEnum.Parent) {
      const isSelf = user.id === currentUserId;
      const isChild = user.parentId === currentUserId;

      if (!isSelf && !isChild) {
        return Result.failure(['You are not allowed to access this user']);
      }
    }

    if (currentUserRole === UserRoleEnum.Member) {
      const isSelf = user.id === currentUserId;
      const isSibling = user.parentId === currentParentId;
      const isParent = user.id === currentParentId;

      if (!isSelf && !isSibling && !isParent) {
        return Result.failure(['You are not allowed to access this user']);
      }

    }

    return Result.success(true);
  }
}