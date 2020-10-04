import { formatMatchKey } from '@/utils/format-match-key'
import { formatTime } from '@/utils/format-time'
import { formatTeamNumber } from '@/utils/format-team-number'
import Card from '@/components/card'
import { css } from 'linaria'
import { memo } from '@/utils/memo'
import clsx from 'clsx'

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

export const MatchCard = memo(
  ({ match, eventKey, link, class: className }: MatchCardProps) => {
    const matchName = formatMatchKey(match.key)

    const createTeamLinks = (teams: string[]) =>
      teams.flatMap((t: string, i) => {
        const num = formatTeamNumber(t)
        return [
          i ? ' ' : null,
          link ? (
            num
          ) : (
            <a key={num} href={`/events/${eventKey}/teams/${num}`}>
              {num}
            </a>
          ),
        ]
      })
    return (
      <Card
        class={clsx(matchCardStyle, className)}
        href={link ? `/events/${eventKey}/matches/${match.key}` : undefined}
      >
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
          {createTeamLinks(match.redAlliance)}
        </div>
        <div class={`${blueStyle} ${allianceStyle}`}>
          {createTeamLinks(match.blueAlliance)}
        </div>
      </Card>
    )
  },
)
