import { request } from '../base'
import { UserInfo } from '.'
import { requestIdleCallback } from 'src/utils/request-idle-callback'
import { transaction } from 'src/cache'
import { idbPromise } from 'src/utils/idb-promise'

const updateCachedUsers = (users: UserInfo[]) =>
  transaction(
    'users',
    (userStore) => {
      // Remove events that are in cache but no longer exist on the server
      idbPromise(userStore.getAll()).then((allUsers: UserInfo[]) => {
        allUsers.forEach((user) => {
          // If the user did not come back in the response
          if (!users.some((u) => u.id === user.id)) {
            // Remove it
            userStore.delete(user.id)
          }
        })
      })
      users.forEach((user) => userStore.put(user, user.id))
    },
    'readwrite',
  )
// Super-admins can view the list of all users, admins can view the list of
// users in their realm.
export const getUsers = () =>
  request<UserInfo[]>('GET', 'users').then((users) => {
    requestIdleCallback(() => updateCachedUsers(users))
    return users
  })
