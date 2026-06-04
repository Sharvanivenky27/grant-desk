/**
 * GrantDesk RBAC Permissions
 */

export type Permission =
  | 'grants:read'
  | 'profile:read'
  | 'profile:write'
  | 'saved:read'
  | 'saved:write'
  | 'admin:read'
  | 'admin:write';

export const PERMISSIONS: Permission[] = [
  'grants:read',
  'profile:read',
  'profile:write',
  'saved:read',
  'saved:write',
  'admin:read',
  'admin:write',
];

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  applicant: [
    'grants:read',
    'profile:read',
    'profile:write',
    'saved:read',
    'saved:write',
  ],
  admin: PERMISSIONS,
};

export function hasPermission(userPermissions: string[], required: Permission): boolean {
  return userPermissions.includes(required);
}

export function hasAnyPermission(userPermissions: string[], required: Permission[]): boolean {
  return required.some((p) => userPermissions.includes(p));
}

export function getPermissionsForRole(roleName: string): Permission[] {
  return ROLE_PERMISSIONS[roleName] ?? [];
}
