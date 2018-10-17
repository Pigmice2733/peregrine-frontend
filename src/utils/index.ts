export const formatTeamNumber = (team: string) => {
  return Number(team.replace(/^frc/, ''))
}

export const formatTime = (date: string, timeZone?: string) =>
  new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    timeZone,
  })

export const formatMatchName = (key: string) => {
  const matchType = key.startsWith('qm')
    ? 'Qual'
    : key.startsWith('ef')
      ? 'Eighths'
      : key.startsWith('qf')
        ? 'Quarters'
        : key.startsWith('sf')
          ? 'Semis'
          : key.startsWith('f')
            ? 'Finals'
            : ''

  const matchNum = key.match(/(\d+)$/)
  if (!matchNum) {
    throw new Error(`Expected ${key} to end in a digit`)
  }
  let groupNum = key.match(/(\d+)m\d+$/)
  if (groupNum) {
    return { group: `${matchType} ${groupNum[1]}`, num: matchNum[1] }
  }
  return { group: `${matchType} ${matchNum[1]}` }
}

export const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return `${start.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })}-${end.toLocaleDateString('en-US', {
    month: start.getMonth() === end.getMonth() ? undefined : 'long',
    day: 'numeric',
  })}`
}
