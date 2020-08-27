import { UserInfo } from '@/api/user'

export const formatUserName = (
  user: UserInfo | undefined | null,
  reporterId: number | null | undefined,
) =>
  user
    ? `${user.firstName} ${user.lastName}`
    : reporterId === null
    ? '[Deleted User]'
    : 'Anonymous'
