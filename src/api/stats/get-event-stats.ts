import { request } from '../base'
import { TeamStats, processTeamStats } from '.'
import { getYears } from '../get-years';

// These are the stats for every team at an event, describing their performance
// only at that event
export const getEventStats = async (eventKey: string, curYear: number) => {
  const schemaYears = await getYears();
  const definedSchema = schemaYears.includes(curYear);

  if(definedSchema){ 
    return request<TeamStats[]>('GET', `events/${eventKey}/stats`).then((teamStats) => {
      return teamStats.map(processTeamStats)
    })
  }
}