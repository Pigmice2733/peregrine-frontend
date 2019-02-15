import { request } from '../base'
import { TeamStats, Stat, NormalizedStat } from '.'
import { formatTeamNumber } from '@/utils/format-team-number'

const normalizeMinMax = (stat: Stat['attempts']) =>
  typeof stat === 'number'
    ? { max: stat, avg: stat, type: 'percent' as 'percent' }
    : { max: stat.max, avg: stat.avg, type: 'number' as 'percent' }

/**
 * Converts an object of stats, to an object of normalized stats
 */
const normalizeStat = (input: { [team: string]: Stat }) =>
  Object.keys(input).reduce<{ [team: string]: NormalizedStat }>(
    (acc, statName) => {
      acc[statName] = {
        attempts: normalizeMinMax(input[statName].attempts),
        successes: normalizeMinMax(input[statName].successes),
      }
      return acc
    },
    {},
  )

// These are the stats for every team at an event, describing their performance
// only at that event
export const getEventStats = (eventKey: string) =>
  request<TeamStats[]>('GET', `events/${eventKey}/stats`).then(stats => {
    return stats.map(stat => ({
      team: formatTeamNumber(stat.team),
      auto: stat.auto && normalizeStat(stat.auto),
      teleop: stat.teleop && normalizeStat(stat.teleop),
    }))
  })
