export const formatTeamNumber = (team: string) => {
  return Number(team.replace(/^frc/, ''))
}

export const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
  })
}

export const formatMatchName = (key: string) => {
  let matchType
  if (key.startsWith('qm')) {
    matchType = 'Qual'
  } else if (key.startsWith('ef')) {
    matchType = 'Eighths'
  } else if (key.startsWith('qf')) {
    matchType = 'Quarters'
  } else if (key.startsWith('sf')) {
    matchType = 'Semis'
  } else if (key.startsWith('f')) {
    matchType = 'Finals'
  }

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
