import { request } from './base'

/** Returns all the years for which we have events */
export const getYears = () => request<number[]>('GET', 'years')
