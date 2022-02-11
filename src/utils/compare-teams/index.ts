const notDigit = /\D+/g
const upToLastDigit = /^.*\d+/

export const compareTeams = (a: string, b: string) => {
  const aNumber = Number.parseInt(a.replace(notDigit, ''))
  const bNumber = Number.parseInt(b.replace(notDigit, ''))
  if (aNumber === bNumber) {
    return a.replace(upToLastDigit, '') > b.replace(upToLastDigit, '') ? 1 : -1
  }
  return aNumber - bNumber
}
