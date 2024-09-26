import { formatMatchKey } from '@/utils/format-match-key'
import { formatTime } from '@/utils/format-time'
import { formatTeamNumber } from '@/utils/format-team-number'
import Card from '@/components/card'
import { css } from '@linaria/core'
import { memo } from '@/utils/memo'
import clsx from 'clsx'
import Icon from './icon'
import { mdiCheckCircle } from '@mdi/js'

interface MatchCardProps {
  match: {
    key: string
    redAlliance: string[]
    blueAlliance: string[]
    time?: Date
    redScore?: number | undefined
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
  grid-template-columns: auto 1rem auto 10rem;
  overflow: hidden;
  text-decoration: none;

  & > time {
    grid-row: span 2;
    grid-column: 3;
    place-self: center center;
    font-size: 0.85rem;
    color: var(--grey-text);
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 0.3rem;
  }
`

const matchTitleStyle = css`
  font-weight: bold;
  grid-row: span 2;
  white-space: nowrap;
  margin: 0.3rem 0.3rem;
  align-content: center;
  text-align: center;

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
  grid-column: 4;
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

const checkmarkStyle = css`
  align-self: center;
  grid-row: span 2;
  filter: opacity(60%);
`

export const MatchDetailsCard = memo(
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
        {typeof match.redScore === 'number' && (
          <Icon icon={mdiCheckCircle} class={checkmarkStyle} />
        )}
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
