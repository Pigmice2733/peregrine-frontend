import { getMatchType, matchNames } from '../match-type'

export const formatMatchKey = (key: string) => {
  // determines the type of match (qualifiers or level of playoffs)
  const matchType = matchNames[getMatchType(key)]
  // determines the number of the match (at the end of the key)
  const matchNum = /(\d+)$/.exec(key)
  if (!matchNum || matchType === undefined) return null // return null if can't identify match type or number
  // group of playoff matches, if applicable
  const groupNum = /(\d+)m\d+$/.exec(key)
  // determine whether there is a group and return the object
  if (groupNum) {
    return { group: `${matchType} ${groupNum[1]}`, num: matchNum[1] }
  }
  return { group: `${matchType} ${matchNum[1]}` }
}
