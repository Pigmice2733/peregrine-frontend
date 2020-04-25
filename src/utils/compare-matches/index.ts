import { getMatchType, matchTypes } from '../match-type'

interface PartialMatch {
  key: string
}

const digitRegex = /\d+/g

export const compareMatchKeys = (aKey: string, bKey: string) => {
  const aType = getMatchType(aKey)
  const bType = getMatchType(bKey)

  if (aType !== bType) return matchTypes[aType] - matchTypes[bType]

  const aDigits = aKey.match(digitRegex) as [string, string?]
  const aMatchNum = aDigits[aDigits.length - 1]
  const bDigits = bKey.match(digitRegex) as [string, string?]
  const bMatchNum = bDigits[bDigits.length - 1]
  if (aMatchNum !== bMatchNum) {
    return (
      ((aMatchNum as unknown) as number) - ((bMatchNum as unknown) as number)
    )
  }
  // Same match num, different groups, compare by group num
  return (
    ((aDigits[0] as unknown) as number) - ((bDigits[0] as unknown) as number)
  )
}

/**
 * Compares 2 matches. Returns negative if a comes first, positive if b comes first
 * @param a First Match
 * @param b Second Match
 */
export const compareMatches = (a: PartialMatch, b: PartialMatch) =>
  compareMatchKeys(a.key, b.key)
