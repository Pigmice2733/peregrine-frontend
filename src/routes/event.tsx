import { h } from 'preact'
import Page from '@/components/page'
import { MatchCard } from '@/components/match-card'
import Spinner from '@/components/spinner'
import { useEventInfo } from '@/cache/events'
import { css } from 'linaria'
import { EventInfoCard } from '@/components/event-info-card'
import Button from '@/components/button'
import { compareMatches } from '@/utils/compare-matches'
import { useEventMatches } from '@/cache/matches'
import { ProcessedMatch } from '@/api/match-info'
import {
  matchNames,
  matchTypes,
  getMatchType,
  MatchType,
} from '@/utils/match-type'
import { nextIncompleteMatch } from '@/utils/next-incomplete-match'

interface Props {
  eventKey: string
}

const noMatches = css`
  display: flex;
  justify-content: center;
  padding: 2rem;
  opacity: 0.5;
`

const eventStyle = css`
  display: flex;
  flex-direction: column;
  --spacing: 1rem;
  padding: calc(var(--spacing) / 2) 2rem;

  & > * {
    margin: calc(var(--spacing) / 2) auto;
  }
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
      <Button href={`/events/${eventKey}/analysis`}>Analysis</Button>
      {eventInfo && <EventInfoCard event={eventInfo} />}
      {newestIncompleteMatch && (
        <MatchCard
          key={newestIncompleteMatch.key}
          match={newestIncompleteMatch}
          href={`/events/${eventKey}/match/${newestIncompleteMatch.key}`}
        />
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
    </Page>
  )
}

export default Event
