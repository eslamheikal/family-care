export enum UserRoleEnum {
  None,
  Admin,
  Employee,
  FamilyParent,
  FamilyMember
}

export function getRoleString(role: UserRoleEnum): string {
  return UserRoleEnum[role].toString().toLowerCase();
}
