import { formatMatchKey } from './format-match-key'

export const formatMatchKeyShort = (matchKey: string) => {
  const formattedMatchKey = formatMatchKey(matchKey)
  // eslint-disable-next-line caleb/@typescript-eslint/no-unnecessary-condition
  const parsed = formattedMatchKey || {group: ""}
  if (parsed.num !== undefined) return `${parsed.group} M${parsed.num}`
  return parsed.group
}
