import { round } from '../round'

export const pxToRem = (input: number) => `${round((14 / 252) * input)}rem`
