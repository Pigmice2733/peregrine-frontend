import { request } from '../base'
import { Schema } from '.'

// Anyone can view the standard schema for a specific year's game
export const getYearSchemaId = (year: number) =>
  request<Schema>('GET', `schemas/year/${year}`)
