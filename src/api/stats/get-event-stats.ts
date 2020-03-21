import { request } from '../base'
import { TeamStats, processTeamStats } from '.'

// These are the stats for every team at an event, describing their performance
// only at that event
export const getEventStats = (eventKey: string) =>
  request<TeamStats[]>('GET', `events/${eventKey}/stats`).then((teamStats) => {
    return teamStats.map(processTeamStats)
  })
