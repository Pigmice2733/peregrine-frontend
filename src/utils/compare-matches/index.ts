import { getMatchType, matchTypes } from '../match-type'

interface PartialMatch {
  key: string
}

const digitRegex = /\d+/g

/**
 * Compares 2 events. Returns negative if a comes first, positive if b comes first
 * @param a First Event
 * @param b Second Event
 */
export const compareMatches = (a: PartialMatch, b: PartialMatch) => {
  const aType = getMatchType(a.key)
  const bType = getMatchType(b.key)

  if (aType !== bType) return matchTypes[aType] - matchTypes[bType]

  const aDigits = a.key.match(digitRegex) as [string, string?]
  const aMatchNum = aDigits[aDigits.length - 1]
  const bDigits = b.key.match(digitRegex) as [string, string?]
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
