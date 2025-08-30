import { DbQueries } from "../lib/db-queries";
import { PaginationOptions } from "../utils/pagination-options";
import { PagedResult } from "../utils/paged-result";
import { User } from "../models/user";
import { UserMapper } from "../mappers/user.mapper";
import { UserRoleEnum } from "../enums/user-role.enum";

export class UserService extends DbQueries {

  constructor() {
    super('users', 'id');
  }

  async getAllParents(): Promise<User[]> {
    const users = await this.getAll();
    return users.map(user => UserMapper.toModel(user)).filter(user => user.role === UserRoleEnum.Parent);
  }

  async getUsersPaged(options: PaginationOptions): Promise<PagedResult<User>> {
    const pagedResult = await this.getPaged({
      ...options,
      searchFields: [], // No search fields available for Family model
      sortBy: 'id', // Use id for sorting instead of joinedDate to avoid null issues
      sortOrder: 'desc'
    });

    return {
      ...pagedResult,
      data: pagedResult.data.map(user => UserMapper.toModel(user))
    };
  }

  async getUser(userId: number): Promise<User | null> {
    const user = await this.getById(userId);

    return user ? UserMapper.toModel(user) : null;
  }

  async addUser(user: User): Promise<User> {
    return this.create(UserMapper.toDbModel(user!));
  }

  async updateUser(userId: number, updateData: User): Promise<User | null> {
    return this.update(userId, UserMapper.toDbModel(updateData));
  }

  async deleteUser(userId: number): Promise<boolean> {
    return this.delete(userId);
  }

}