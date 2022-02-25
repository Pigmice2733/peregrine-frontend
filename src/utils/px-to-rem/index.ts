import { round } from '../round'

// eslint-disable-next-line caleb/@typescript-eslint/restrict-plus-operands
export const pxToRem = (input: number) => round((14 / 252) * input) + 'rem'
