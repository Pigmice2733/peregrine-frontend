import { getMatchType, matchNames } from '../match-type'

export const formatMatchKey = (key: string) => {
  const matchType = matchNames[getMatchType(key)]
  const matchNum = key.match(/(\d+)$/)
  if (!matchNum || matchType === '') return { group: key.toUpperCase() }
  const groupNum = key.match(/(\d+)m\d+$/)
  if (groupNum) {
    return { group: `${matchType} ${groupNum[1]}`, num: matchNum[1] }
  }
  return { group: `${matchType} ${matchNum[1]}` }
}
