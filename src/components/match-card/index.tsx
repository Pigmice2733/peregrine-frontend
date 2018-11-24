import { h } from 'preact'
import { formatMatchKey } from '@/utils/format-match-key'
import { formatTime } from '@/utils/format-time'
import { formatTeamNumber } from '@/utils/format-team-number'
import Card, { CardProps } from '@/components/card'

import style from './style.css'

type MatchCardProps = CardProps<{
  match: {
    key: string
    redAlliance: string[]
    blueAlliance: string[]
    time?: Date
  }
  key?: string | number
}>

export const MatchCard = ({ match, ...rest }: MatchCardProps) => {
  const matchName = formatMatchKey(match.key)
  return (
    <Card class={style.matchCard} {...rest}>
      <div class={style.matchTitle}>
        <div>{matchName.group}</div>
        {matchName.num && (
          <div class={style.matchNum}>{`Match ${matchName.num}`}</div>
        )}
      </div>
      {match.time && (
        <time dateTime={match.time.toISOString()}>
          {formatTime(match.time)}
        </time>
      )}
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
    </Card>
  )
}
