import { formatMatchKey } from './format-match-key'

export const formatMatchKeyShort = (matchKey: string) => {
  const parsed = formatMatchKey(matchKey)
  if (parsed.num !== undefined) return `${parsed.group} M${parsed.num}`
  return parsed.group
}
