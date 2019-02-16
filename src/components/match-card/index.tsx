import { h } from 'preact'
import { formatMatchKey } from '@/utils/format-match-key'
import { formatTime } from '@/utils/format-time'
import { formatTeamNumber } from '@/utils/format-team-number'
import Card from '@/components/card'

import style from './style.css'

type MatchCardProps = {
  match: {
    key: string
    redAlliance: string[]
    blueAlliance: string[]
    time?: Date
  }
  key?: string | number
  href?: string
}

export const MatchCard = ({ match, href }: MatchCardProps) => {
  const matchName = formatMatchKey(match.key)
  return (
    <Card class={style.matchCard} href={href}>
      <div class={style.matchTitle}>
        {matchName.num ? <div>{matchName.group}</div> : matchName.group}
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
        {match.redAlliance.map(t => formatTeamNumber(t)).join(' ')}
      </div>
      <div class={`${style.blue} ${style.alliance}`}>
        {match.blueAlliance.map(t => formatTeamNumber(t)).join(' ')}
      </div>
    </Card>
  )
}
