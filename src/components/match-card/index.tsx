import { h } from 'preact'
import { MatchInfo } from '../../api'
import { formatTeamNumber, formatMatchName, formatTime } from '../../utils'
import style from './style.css'

interface MatchCardProps {
  match: MatchInfo
  key?: string | number
}

export const MatchCard = ({ match }: MatchCardProps) => {
  const matchName = formatMatchName(match.key)
  return (
    <div class={style.matchCard}>
      <div class={style.matchTitle}>
        <div>{matchName.group}</div>
        {matchName.num && (
          <div class={style.matchNum}>{`Match ${matchName.num}`}</div>
        )}
      </div>
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
}
