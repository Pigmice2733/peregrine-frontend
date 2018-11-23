import { request } from '../base'
import { Schema } from '.'

// Anyone can view a specific schema
export const getSchema = (id: number) => request<Schema>('GET', `schemas/${id}`)
