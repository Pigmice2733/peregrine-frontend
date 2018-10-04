export const formatTeamNumber = (team: string) => {
  return Number(team.replace(/^frc/, ''))
}
export const formatTime = (date: string) => {
  return new Date(date)
}
