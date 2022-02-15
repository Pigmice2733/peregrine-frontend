import { request } from '../base'
import { TeamStats, processTeamStats } from '.'
import { getYearSchema } from '../schema/get-year-schema'

// These are the stats for every team at an event, describing their performance
// only at that event
export const getEventStats = async (eventKey: string, curYear: number) => {
  const schemaLength = (await getYearSchema(curYear)).schema.length

  if(schemaLength !== 0){ 
    return request<TeamStats[]>('GET', `events/${eventKey}/stats`).then((teamStats) => {
      return teamStats.map(processTeamStats)
    })
  }
}