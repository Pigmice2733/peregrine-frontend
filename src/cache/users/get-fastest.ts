import { getUser } from '@/api/user/get-user'
import { createPromiseRace } from '@/utils/fastest-promise'
import { getCachedUser } from './get-cached'

export const getFastestUser = createPromiseRace(getUser, getCachedUser)

// TODO: Next time work on clearing IDB when logged out
// https://github.com/Pigmice2733/peregrine-frontend/issues/1097
