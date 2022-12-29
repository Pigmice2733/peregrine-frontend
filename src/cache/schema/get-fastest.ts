import { createPromiseRace } from 'src/utils/fastest-promise'
import { getSchema } from 'src/api/schema/get-schema'
import { getCachedSchema } from './get-cached'

export const getFastestSchema = createPromiseRace(getSchema, getCachedSchema)
