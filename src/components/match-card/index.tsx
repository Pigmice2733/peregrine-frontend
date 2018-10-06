import { h } from 'preact'
import { MatchInfo } from '../../api'
import { formatTeamNumber } from '../../utils'

interface MatchCardProps {
  match: MatchInfo
}

export const MatchCard = ({ match }: MatchCardProps) => (
  <div>
    <h1>{match.key}</h1>
    <h2>{match.time}</h2>
    <h2 style={{ color: 'red' }}>
      {match.redAlliance.map(formatTeamNumber).join(' ')}
    </h2>
    <h2 style={{ color: 'blue' }}>
      {match.blueAlliance.map(formatTeamNumber).join(' ')}
    </h2>
  </div>
)
