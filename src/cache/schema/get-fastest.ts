import { createPromiseRace } from '@/utils/fastest-promise'
import { getSchema } from '@/api/schema/get-schema'
import { getCachedSchema } from './get-cached'

export const getFastestSchema = createPromiseRace(getSchema, getCachedSchema)
