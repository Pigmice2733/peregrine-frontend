import { UserInfo } from '@/api/user'

export const formatUserName = (user: UserInfo | undefined | null) =>
  user ? `${user.firstName} ${user.lastName}` : 'Anonymous'
