import { h } from 'preact'
import { formatMatchKey } from '@/utils/format-match-key'
import { formatTime } from '@/utils/format-time'
import { formatTeamNumber } from '@/utils/format-team-number'
import Card from '@/components/card'
import { css } from 'linaria'

interface MatchCardProps {
  match: {
    key: string
    redAlliance: string[]
    blueAlliance: string[]
    time?: Date
  }
  key?: string | number
  href?: string
}

const matchCardStyle = css`
  margin: 0.7rem auto;
  width: 23rem;
  font-size: 0.93rem;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 1fr minmax(auto, 10rem);
  overflow: hidden;
  text-decoration: none;
  color: inherit;

  & > time {
    grid-row: span 2;
    place-self: center end;
    font-size: 0.85rem;
    color: var(--grey-text);
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const matchTitleStyle = css`
  font-weight: bold;
  grid-row: span 2;
  white-space: nowrap;
  margin: 0.3rem 0.7rem;
  & > * {
    margin: 0.3rem 0;
  }
`

const matchNumStyle = css`
  grid-row: 2;
  text-transform: uppercase;
  font-weight: normal;
  font-size: 0.8rem;
  font-family: 'Roboto Condensed', 'Roboto';
  color: var(--grey-text);
`

const allianceStyle = css`
  grid-column: 3;
  color: white;
  font-weight: bold;
  align-self: stretch;
  margin-left: 0.3rem;
  padding: 0.35rem 0.8rem;
  text-align: center;
  text-align-last: justify;
`

const redStyle = css`
  background-color: var(--alliance-red);
`

const blueStyle = css`
  background-color: var(--alliance-blue);
`

export const MatchCard = ({ match, href }: MatchCardProps) => {
  const matchName = formatMatchKey(match.key)
  return (
    <Card class={matchCardStyle} href={href}>
      <div class={matchTitleStyle}>
        {matchName.num ? <div>{matchName.group}</div> : matchName.group}
        {matchName.num && (
          <div class={matchNumStyle}>{`Match ${matchName.num}`}</div>
        )}
      </div>
      {match.time && (
        <time dateTime={match.time.toISOString()}>
          {formatTime(match.time)}
        </time>
      )}
      <div class={`${redStyle} ${allianceStyle}`}>
        {match.redAlliance.map(t => formatTeamNumber(t)).join(' ')}
      </div>
      <div class={`${blueStyle} ${allianceStyle}`}>
        {match.blueAlliance.map(t => formatTeamNumber(t)).join(' ')}
      </div>
    </Card>
  )
}
