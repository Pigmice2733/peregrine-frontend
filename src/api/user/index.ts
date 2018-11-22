interface Roles {
  isAdmin: boolean
  isVerified: boolean
}

export interface UserInfo {
  username: string
  firstName: string
  lastName: string
  roles: Roles
  stars: string[]
}

export interface EditableUser extends UserInfo {
  password: string
  // Only admins can set roles, and they can do so for any user
  roles: Roles
}
