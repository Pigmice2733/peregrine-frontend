import { h, Fragment } from 'preact'
import Page from '@/components/page'
import { MatchCard } from '@/components/match-card'
import Spinner from '@/components/spinner'
import { useEventInfo } from '@/cache/events'
import { css } from 'linaria'
import { EventInfoCard } from '@/components/event-info-card'
import Button from '@/components/button'
import { useEventMatches } from '@/cache/matches'
import {
  matchNames,
  matchTypes,
  getMatchType,
  MatchType,
} from '@/utils/match-type'
import { nextIncompleteMatch } from '@/utils/next-incomplete-match'
import { Heading } from '@/components/heading'

interface Props {
  eventKey: string
}

const spacing = '1.4rem'

const noMatches = css`
  display: flex;
  justify-content: center;
  padding: 2rem;
  opacity: 0.5;
`

const eventStyle = css`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: start;
  grid-gap: ${spacing};
  padding: ${spacing};
  margin-top: 0.5rem;

  @media (min-width: 950px) {
    grid-template-columns: auto auto;
  }
`

const sectionStyle = css`
  display: grid;
  grid-template-columns: auto;
  justify-items: center;
  grid-gap: ${spacing};
`

const headingStyle = css`
  font-size: 1.2rem;
`

const Event = ({ eventKey }: Props) => {
  const matches = useEventMatches(eventKey)
  const eventInfo = useEventInfo(eventKey)
  const newestIncompleteMatch = matches && nextIncompleteMatch(matches)

  const matchGroups =
    matches &&
    [
      ...matches.reduce((groups, match) => {
        const matchType = getMatchType(match.key)
        groups.add(matchType)
        return groups
      }, new Set<MatchType>()),
    ].sort((a, b) => matchTypes[a] - matchTypes[b])

  return (
    <Page
      name={(eventInfo && eventInfo.name) || <code>{eventKey}</code>}
      back="/"
      class={eventStyle}
    >
      <div class={sectionStyle}>
        {eventInfo && <EventInfoCard event={eventInfo} />}
        <Button href={`/events/${eventKey}/analysis`}>Analysis</Button>
      </div>
      <div class={sectionStyle}>
        {newestIncompleteMatch && (
          <Fragment>
            <Heading level={2} class={headingStyle}>
              Next Match
            </Heading>
            <MatchCard
              key={newestIncompleteMatch.key}
              match={newestIncompleteMatch}
              href={`/events/${eventKey}/match/${newestIncompleteMatch.key}`}
            />
          </Fragment>
        )}
        {matchGroups ? (
          matchGroups.length === 0 ? (
            <div class={noMatches}>No matches yet</div>
          ) : (
            matchGroups.map(g => (
              <Button key={g} href={`/events/${eventKey}/matches/${g}`}>
                {g === 'qm' ? 'Qualifications' : matchNames[g]}
              </Button>
            ))
          )
        ) : (
          <Spinner />
        )}
      </div>
    </Page>
  )
}

export default Event
