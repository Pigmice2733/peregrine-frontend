import { transaction } from '..'
import { preventUndefinedResolve } from '@/utils/prevent-undefined-resolve'
import { UserInfo } from '@/api/user'

export const getCachedUser = (userId: number) =>
  transaction<UserInfo | undefined>('users', (userStore) =>
    userStore.get(userId),
  ).then(preventUndefinedResolve)
