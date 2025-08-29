import { DbQueries } from "../lib/db-queries";
import { PaginationOptions } from "../utils/pagination-options";
import { PagedResult } from "../utils/paged-result";
import { Family } from "../models/family.model";
import { FamilyMember } from "../models/family-member.model";
import { FamilyMapper } from "../mappers/family.mapper";

export class FamilyService extends DbQueries {
  private familyMemberQueries: DbQueries;

  constructor() {
    super('families', 'id');
    this.familyMemberQueries = new DbQueries('family-members', 'id');
  }

  async getAllFamilies(): Promise<Family[]> {
    const families = await this.getAll();
    return families.map(family => FamilyMapper.toModel(family));
  }

  /**
   * Get families with server-side pagination and search
   */
  async getFamiliesPaged(options: PaginationOptions): Promise<PagedResult<Family>> {
    const pagedResult = await this.getPaged({
      ...options,
      searchFields: [], // No search fields available for Family model
      sortBy: 'id', // Use id for sorting instead of joinedDate to avoid null issues
      sortOrder: 'desc'
    });

    return {
      ...pagedResult,
      data: pagedResult.data.map(family => FamilyMapper.toModel(family))
    };
  }

  /**
   * Get family by ID
   */
  async getFamily(familyId: number): Promise<Family | null> {
    const family = await this.getById(familyId);

    return family ? FamilyMapper.toModel(family) : null;
  }

  /**
   * Add new family
   */
  async addFamily(family: Family): Promise<Family> {
    return this.create(FamilyMapper.toDbModel(family!));
  }

  /**
   * Update family
   */
  async updateFamily(familyId: number, updateData: Family): Promise<Family | null> {
    return this.update(familyId, FamilyMapper.toDbModel(updateData));
  }

  /**
   * Delete family
   */
  async deleteFamily(familyId: number): Promise<boolean> {
    return this.delete(familyId);
  }

  /**
   * Get family members by family ID
   */
  async getFamilyMembers(familyId: number): Promise<FamilyMember[]> {
    return this.familyMemberQueries.query({
      where: { familyId }
    });
  }

  /**
   * Get specific family member
   */
  async getFamilyMember(familyId: number, memberId: string): Promise<FamilyMember | null> {
    const member = await this.familyMemberQueries.getById(memberId);
    if (member && member.familyId === familyId) {
      return member;
    }
    return null;
  }

  /**
   * Add family member
   */
  async addFamilyMember(member: Partial<FamilyMember>): Promise<FamilyMember> {
    return this.familyMemberQueries.create(member);
  }

  /**
   * Update family member
   */
  async updateFamilyMember(familyId: number, memberId: string, updateData: Partial<FamilyMember>): Promise<FamilyMember | null> {
    const member = await this.familyMemberQueries.getById(memberId);
    if (member && member.familyId === familyId) {
      return this.familyMemberQueries.update(memberId, updateData);
    }
    return null;
  }

  /**
   * Delete family member
   */
  async deleteFamilyMember(familyId: number, memberId: string): Promise<boolean> {
    const member = await this.familyMemberQueries.getById(memberId);
    if (member && member.familyId === familyId) {
      return this.familyMemberQueries.delete(memberId);
    }
    return false;
  }

  /**
   * Get family members with server-side pagination
   */
  async getFamilyMembersPaged(familyId: number, options: PaginationOptions): Promise<PagedResult<FamilyMember>> {
    return this.familyMemberQueries.getPaged({
      ...options,
      filters: { familyId },
      searchFields: ['name', 'email', 'phone'],
      sortBy: 'name',
      sortOrder: 'asc'
    });
  }

  /**
   * Get active families only
   */
  async getActiveFamilies(): Promise<Family[]> {
    return this.query({
      where: { isActive: true }
    });
  }

  /**
   * Get families by join date range
   */
  async getFamiliesByDateRange(startDate: string, endDate: string): Promise<Family[]> {
    const allFamilies = await this.getAll();
    return allFamilies.filter(family => {
      const joinDate = family.joinedDate;
      return joinDate && joinDate >= startDate && joinDate <= endDate;
    });
  }

  /**
   * Get family statistics
   */
  async getFamilyStats(): Promise<{
    totalFamilies: number;
    activeFamilies: number;
    inactiveFamilies: number;
  }> {
    const allFamilies = await this.getAll();
    const activeFamilies = allFamilies.filter(f => f.isActive);
    
    return {
      totalFamilies: allFamilies.length,
      activeFamilies: activeFamilies.length,
      inactiveFamilies: allFamilies.length - activeFamilies.length
    };
  }
}