const digits = 2
const round = (input: number) => Math.round(input * 10 ** digits) / 10 ** digits

export const createShadow = (elevation: number) => {
  if (elevation === 0) {
    return 'none'
  }
  const ambientY = elevation
  const ambientBlur = elevation === 1 ? 3 : elevation * 2
  const ambientAlpha = round((elevation + 10 + elevation / 9.38) / 100)

  const ambientShadow = `0px ${ambientY}px ${ambientBlur}px rgba(0, 0, 0, ${ambientAlpha})`

  const directY =
    elevation < 10
      ? elevation % 2 === 0
        ? elevation - (elevation / 2 - 1)
        : elevation - (elevation - 1) / 2
      : elevation - 4
  const directBlur = elevation === 1 ? 3 : elevation * 2
  const directAlpha = (24 - Math.round(elevation / 10)) / 100

  const directShadow = `0px ${directY}px ${directBlur}px rgba(0, 0, 0, ${directAlpha})`

  return `${ambientShadow}, ${directShadow}`
}
