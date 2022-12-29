import { getUser } from 'src/api/user/get-user'
import { createPromiseRace } from 'src/utils/fastest-promise'
import { getCachedUser } from './get-cached'

export const getFastestUser = createPromiseRace(getUser, getCachedUser)
