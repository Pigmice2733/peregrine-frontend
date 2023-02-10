import { formatMatchKey } from '@/utils/format-match-key'
import { formatTime } from '@/utils/format-time'
import { formatTeamNumber } from '@/utils/format-team-number'
import Card from '@/components/card'
import { css } from 'linaria'
import { memo } from '@/utils/memo'
import clsx from 'clsx'
import { useEventInfo } from '@/cache/event-info/use'

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
  matchPage?: boolean
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
  grid-column: 1;
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

const eventAndTimeStyle = css`
  grid-row: 1 / span 2;
  grid-column: 2;
`

const eventNameStyle = css`
  font-weight: bold;
  grid-row: 1;
  white-space: nowrap;
  text-align: center;
  align-self: center;
`

const dateTimeStyle = css`
  align-self: center;
  grid-row: 2;
  font-size: 0.8rem;
`

const allianceStyle = css`
  white-space: nowrap;
  grid-column: 3;
  align-self: stretch;
  margin-left: 0.3rem;
  padding: 0.35rem 0.8rem;
  text-align: center;
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
  ({ match, eventKey, link, class: className, matchPage }: MatchCardProps) => {
    const matchName = formatMatchKey(match.key)
    const eventName = useEventInfo(eventKey)?.name

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
        <div class={eventAndTimeStyle}>
          {matchPage && (
            <div class={eventNameStyle}>
              {' '}
              at <a href={`/events/${eventKey}`}>{eventName}</a>{' '}
            </div>
          )}
          {match.time && (
            <time dateTime={match.time.toISOString()} class={dateTimeStyle}>
              {formatTime(match.time)}
            </time>
          )}
        </div>
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
