export interface Roles {
  isSuperAdmin: boolean
  isAdmin: boolean
  isVerified: boolean
}

export interface BaseUserInfo {
  username: string
  firstName: string
  lastName: string
  roles: Roles
  stars: string[]
}

export interface UserInfo extends BaseUserInfo {
  id: number
}

export interface EditableUser extends BaseUserInfo {
  password: string
  // Only admins can set roles, and they can do so for any user in their realm.
  // Super-admins can set roles for any user.
  roles: Roles
}
