const notDigit = /\D+/g
const upToLastDigit = /^.*\d+/

export const compareTeams = (a: string, b: string) => {
  const aNumber = parseInt(a.replace(notDigit, ''))
  const bNumber = parseInt(b.replace(notDigit, ''))
  if (aNumber === bNumber) {
    return a.replace(upToLastDigit, '') > b.replace(upToLastDigit, '') ? 1 : -1
  }
  return aNumber - bNumber
}
