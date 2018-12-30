import { request } from '../base'
import { TeamStats, Stat, NormalizedStat } from '.'
import { formatTeamNumber } from '@/utils/format-team-number'

const normalizeMinMax = (stat: Stat['attempts']) =>
  typeof stat === 'number'
    ? { max: stat, avg: stat, type: 'percent' as 'percent' }
    : { max: stat.max, avg: stat.avg, type: 'number' as 'percent' }

/**
 * Converts an array of stats, to an object of normalized stats
 */
const normalizeStat = (input: Stat[]) =>
  input.reduce<{ [key: string]: NormalizedStat }>((acc, stat) => {
    acc[stat.statName] = {
      attempts: normalizeMinMax(stat.attempts),
      successes: normalizeMinMax(stat.successes),
    }
    return acc
  }, {})

// These are the stats for every team at an event, describing their performance
// only at that event
export const getEventStats = (eventKey: string) =>
  request<TeamStats[]>('GET', `events/${eventKey}/stats`).then(stats =>
    stats.map(team => ({
      team: formatTeamNumber(team.team),
      auto: normalizeStat(team.auto),
      teleop: normalizeStat(team.teleop),
    })),
  )
