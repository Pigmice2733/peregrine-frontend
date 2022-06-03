/* eslint-disable caleb/@typescript-eslint/no-unnecessary-condition */
import { formatMatchKey } from '@/utils/format-match-key'
import { formatTime } from '@/utils/format-time'
import { formatTeamNumber } from '@/utils/format-team-number'
import Card from '@/components/card'
import { css } from 'linaria'
import { memo } from '@/utils/memo'
import preact from 'preact'

interface MatchCardProps {
  match: {
    key: string
    redAlliance: string[]
    blueAlliance: string[]
    time?: Date
  }
  key?: string | number
  eventKey: string
  link?: boolean
  class?: string
}

const matchCardStyle = css`
  font-size: 0.93rem;
  align-items: center;
  display: grid;
  grid-template-columns: auto auto 10rem;
  overflow: hidden;
  text-decoration: none;

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
  margin: 0.3rem 0.6rem;
  & > * {
    margin: 0.3rem 0;
  }
`

const matchNumStyle = css`
  grid-row: 2;
  text-transform: uppercase;
  font-weight: normal;
  font-size: 0.8rem;
  font-family: 'Roboto Condensed', 'Roboto', sans-serif;
  color: var(--grey-text);
`

const allianceStyle = css`
  white-space: nowrap;
  grid-column: 3;
  align-self: stretch;
  margin-left: 0.3rem;
  padding: 0.35rem 0.8rem;
  text-align: center;
  text-align-last: justify;
  color: white;
  font-weight: bold;

  & > * {
    color: white;
    text-decoration: none;
    padding: 0.2rem;
  }
`

const redStyle = css`
  background-color: var(--alliance-red);
`

const blueStyle = css`
  background-color: var(--alliance-blue);
`

export const MatchDetailsCard = memo(
  ({ match, eventKey, link }: MatchCardProps) => {
    const matchName = formatMatchKey(match.key)

    const createTeamLinks = (teams: string[]) =>
      teams.flatMap((t: string, i) => {
        const num = formatTeamNumber(t)
        const El = link ? preact.Fragment : 'a'
        return [
          i ? ' ' : null,
          <El key={num} href={`/events/${eventKey}/teams/${num}`}>
            {num}
          </El>,
        ]
      })
    return (
      <Card
        class={matchCardStyle}
        href={link ? `/events/${eventKey}/matches/${match.key}` : undefined}
      >
        <div class={matchTitleStyle}>
          {matchName ? (
            matchName.num ? (
              <div>{matchName.group}</div>
            ) : (
              matchName.group
            )
          ) : (
            <div> {match.key} </div>
          )}
          {matchName
            ? matchName.num && (
                <div class={matchNumStyle}>{`Match ${matchName.num}`}</div>
              )
            : ''}
        </div>
        {match.time && (
          <time dateTime={match.time.toISOString()}>
            {formatTime(match.time)}
          </time>
        )}
        <div class={`${redStyle} ${allianceStyle}`}>
          {createTeamLinks(match.redAlliance)}
        </div>
        <div class={`${blueStyle} ${allianceStyle}`}>
          {createTeamLinks(match.blueAlliance)}
        </div>
      </Card>
    )
  },
)
