import { transaction } from '..'
import { preventUndefinedResolve } from 'src/utils/prevent-undefined-resolve'
import { UserInfo } from 'src/api/user'

export const getCachedUser = (userId: number) =>
  transaction<UserInfo | undefined>('users', (userStore) =>
    userStore.get(userId),
  ).then(preventUndefinedResolve)
