export const lerp = (
  minIn: number,
  maxIn: number,
  minOut: number,
  maxOut: number,
) => {
  const inRange = maxIn - minIn
  const outRange = maxOut - minOut

  return (value: number) => {
    const percent = (value - minIn) / inRange
    return percent * outRange + minOut
  }
}
