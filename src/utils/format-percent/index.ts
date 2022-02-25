export const formatPercent = (input: number) =>
  // eslint-disable-next-line caleb/@typescript-eslint/restrict-plus-operands
  Math.round(input * 1000) / 10 + '%'
