import { request } from '../base'
import { TeamStats } from '.'
import { formatTeamNumber } from '@/utils/format-team-number'

const processTeamStats = (singleTeamStats: TeamStats): TeamStats => ({
  team: formatTeamNumber(singleTeamStats.team),
  auto: singleTeamStats.auto,
  teleop: singleTeamStats.teleop,
})

// These are the stats for every team at an event, describing their performance
// only at that event
export const getEventStats = (eventKey: string) =>
  request<TeamStats[]>('GET', `events/${eventKey}/stats`).then(teamStats => {
    return teamStats.map(processTeamStats)
  })
