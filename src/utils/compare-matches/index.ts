interface PartialEvent {
  key: string
}

const matchTypes = {
  qm: 0,
  qf: 1,
  sf: 2,
  f: 3,
}

const getMatchType = (k: string) => (k.match(/^[\D]+/) as [string])[0]

const digitRegex = /\d+/g

/**
 * Compares 2 events. Returns negative if a comes first, positive if b comes first
 * @param a First Event
 * @param b Second Event
 */
export const compareMatches = (a: PartialEvent, b: PartialEvent) => {
  const aType = getMatchType(a.key) as keyof typeof matchTypes
  const bType = getMatchType(b.key) as keyof typeof matchTypes
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
