import { h } from 'preact'
import { MatchInfo } from '@/api'
import { formatMatchKey } from '@/utils/format-match-key'
import { formatTime } from '@/utils/format-time'
import { formatTeamNumber } from '@/utils/format-team-number'
import style from './style.css'

interface MatchCardProps {
  match: MatchInfo
  key?: string | number
}

export const MatchCard = ({ match }: MatchCardProps) => {
  const matchName = formatMatchKey(match.key)
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
