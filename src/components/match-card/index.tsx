import { h } from 'preact'
import { MatchInfo } from '../../api'
import { formatTeamNumber, formatMatchName, formatTime } from '../../utils'
import style from './style.css'

interface MatchCardProps {
  match: MatchInfo
  key?: string | number
}

export const MatchCard = ({ match }: MatchCardProps) => (
  <div class={style.matchCard}>
    <div>{formatMatchName(match.key)}</div>
    <time dateTime={match.time}>{formatTime(match.time)}</time>
    <div class={`${style.red} ${style.alliance}`}>
      {match.redAlliance.map(t => (
        <div key={t}>{formatTeamNumber(t)}</div>
      ))}
    </div>
    <div class={`${style.blue} ${style.alliance}`}>
      {match.blueAlliance.map(t => (
        <div key={t}>{formatTeamNumber(t)}</div>
      ))}
    </div>
  </div>
)
