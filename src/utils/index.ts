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
    : key.startsWith('qf')
      ? 'Quarters'
      : key.startsWith('sf')
        ? 'Semis'
        : key.startsWith('f')
          ? 'Finals'
          : ''

  const matchNum = key.match(/(\d+)$/)
  if (!matchNum || matchType === '') return { group: key.toUpperCase() }

  let groupNum = key.match(/(\d+)m\d+$/)
  if (groupNum) {
    return { group: `${matchType} ${groupNum[1]}`, num: matchNum[1] }
  }
  return { group: `${matchType} ${matchNum[1]}` }
}

export const formatDateRange = (
  startDate: string,
  endDate: string,
  timeZone?: string,
) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const sameYear = start.getFullYear() === end.getFullYear()
  const sameMonth = sameYear && start.getMonth() === end.getMonth()
  const sameDay = sameMonth && start.getDate() === end.getDate()
  return (
    start.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      timeZone,
    }) +
    (sameDay
      ? ''
      : '-' +
        end.toLocaleDateString('en-US', {
          month: sameMonth ? undefined : 'long',
          day: 'numeric',
          timeZone,
        }))
  )
}
