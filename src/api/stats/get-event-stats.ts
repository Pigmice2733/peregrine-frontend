import { request } from '../base'
import { TeamStats, Stat, ProcessedTeamStats } from '.'
import { formatTeamNumber } from '@/utils/format-team-number'

const processTeamStats = (singleTeamStats: TeamStats): ProcessedTeamStats => ({
  team: formatTeamNumber(singleTeamStats.team),
  summary: singleTeamStats.summary.reduce((acc, val) => {
    acc[val.name] = val
    return acc
  }, {} as { [key: string]: Stat }),
})

// These are the stats for every team at an event, describing their performance
// only at that event
export const getEventStats = (eventKey: string) =>
  request<TeamStats[]>('GET', `events/${eventKey}/stats`).then(teamStats => {
    return teamStats.map(processTeamStats)
  })
