import { request } from '../base'
import { Schema } from '.'

// Anyone can view the schemas
export const getSchemas = () => request<Schema[]>('GET', `schemas`)
