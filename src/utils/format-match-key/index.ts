export const formatMatchKey = (key: string) => {
  const matchType = key.startsWith('qm')
    ? 'Qual'
    : key.startsWith('qf')
    ? 'Quarters'
    : key.startsWith('sf')
    ? 'Semis'
    : key.startsWith('f')
    ? 'Finals'
    : ''
  const matchNum = key.match(/(\d+)$/)
  if (!matchNum || matchType === '') return { group: key.toUpperCase() }
  const groupNum = key.match(/(\d+)m\d+$/)
  if (groupNum) {
    return { group: `${matchType} ${groupNum[1]}`, num: matchNum[1] }
  }
  return { group: `${matchType} ${matchNum[1]}` }
}
