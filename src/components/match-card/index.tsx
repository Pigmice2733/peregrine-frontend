import { h } from 'preact'
import { MatchInfo } from '../../api'
import { formatTeamNumber, formatMatchName, formatTime } from '../../utils'
import style from './style.css'

interface MatchCardProps {
  match: MatchInfo
}

export const MatchCard = ({ match }: MatchCardProps) => (
  <div class={style.matchCard}>
    <h1>{formatMatchName(match.key.replace(/^.*_/, ''))}</h1>
    <h2>{formatTime(match.time)}</h2>
    <h2 style={{ color: 'red' }}>
      {match.redAlliance.map(formatTeamNumber).join(' ')}
    </h2>
    <h2 style={{ color: 'blue' }}>
      {match.blueAlliance.map(formatTeamNumber).join(' ')}
    </h2>
  </div>
)
