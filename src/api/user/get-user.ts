import { request } from '../base'
import { UserInfo } from '.'
import { requestIdleCallback } from '@/utils/request-idle-callback'
import { transaction } from '@/cache'

const updateCachedUser = (user: UserInfo) =>
  transaction(
    'users',
    (userStore) => {
      userStore.put(user, user.id)
    },
    'readwrite',
  )

// Super-admins can view any user, admins can view any user in their realm,
// users can view themselves
export const getUser = (userId: number | string) =>
  request<UserInfo>('GET', `users/${userId}`).then((user) => {
    requestIdleCallback(() => updateCachedUser(user))
    return user
  })
