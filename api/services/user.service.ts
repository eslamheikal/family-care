import { DbQueries } from "../lib/db-queries";
import { User } from "../models/user";
import { UserMapper } from "../mappers/user.mapper";
import { UserRoleEnum } from "../enums/user-role.enum";
import { Result } from "../utils/result";
import { PagedList } from "../utils/paged-list.model";
import { QueryParamsModel } from "../utils/query-params.model";
import { DbCommands } from "../lib/db-commands";
import { DB_TABLES } from "../lib/db-tables.const";

const userCommands = new DbCommands('users', 'id');
const userQueries = new DbQueries('users', 'id');

export class UserService {

  async getAllParents(): Promise<User[]> {
    const users = await userQueries.getAll();
    return users.map(user => UserMapper.toModel(user)).filter(user => user.role === UserRoleEnum.Parent);
  }

  async getUsersPaged(options: QueryParamsModel): Promise<PagedList<User>> {
    const pagedList = await userQueries.getPaged(options);

    return {
      items: pagedList.items.map(user => UserMapper.toModel(user)),
      totalCount: pagedList.totalCount,
      pageCount: pagedList.pageCount
    };
  }

  async getUser(userId: number): Promise<Result<User>> {
    const user = await userQueries.getById(userId);

    return user ? Result.success(UserMapper.toModel(user)) : Result.failure(['User not found']);
  }

  async addUser(user: User): Promise<Result<User>> {

    // check if user already exists by email or phone
    const hasDuplicate = await this.hasDuplicate(user.email, user.phone!);
    if (!hasDuplicate.isSuccess) {
      return hasDuplicate;
    }

    await userCommands.create(UserMapper.toDbModel(user!));
    return Result.success(user);
  }

  async updateUser(updateData: User): Promise<Result<User>> {
    // check if user already exists by email or phone
    const hasDuplicate = await this.hasDuplicate(updateData.email, updateData.phone!);
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

  async hasDuplicate(email: string, phone: string): Promise<Result<User>> {

    // check if user already exists by email or phone
    const userExists = await userQueries.query({ where: { email: email, phone: phone } });

    if (userExists.length > 0 && userExists[0].email === email) {
      return Result.failure(['User already exists with this email']);
    }

    if (userExists.length > 0 && userExists[0].phone === phone) {
      return Result.failure(['User already exists with this phone']);
    }

    return Result.success(userExists[0]);
  }

}