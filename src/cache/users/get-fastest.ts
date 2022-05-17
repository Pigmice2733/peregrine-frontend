import { getUser } from '@/api/user/get-user'
import { createPromiseRace } from '@/utils/fastest-promise'
import { getCachedUser } from './get-cached'

export const getFastestUser = createPromiseRace(getUser, getCachedUser)
