import { h } from 'preact'
import Page from '@/components/page'
import { matchNames, MatchType, getMatchType } from '@/utils/match-type'
import { useEventInfo } from '@/cache/events'
import { useEventMatches } from '@/cache/matches'
import { MatchCard } from '@/components/match-card'
import { compareMatches } from '@/utils/compare-matches'
import { UnstyledList } from '@/components/unstyled-list'
import { useState } from 'preact/hooks'
import TextInput from '@/components/text-input'
import { css } from 'linaria'
import { decode, encode } from 'qss'
import { ProcessedMatch } from '@/api/match-info'
import Spinner from '@/components/spinner'

interface Props {
  eventKey: string
  matchType: MatchType
}

const matchGroupStyle = css`
  display: grid;
  justify-content: center;
`

const matchListStyle = css`
  display: grid;
  grid-template-columns: 21rem;
  grid-gap: 0.7rem;
`

const getCurrentUrlQuery = () => decode(window.location.search.substr(1))

const matchMatchesQuery = (m: ProcessedMatch, query: string) =>
  m.key.includes(query) ||
  m.redAlliance.includes('frc' + query) ||
  m.blueAlliance.includes('frc' + query)

const EventMatchGroup = ({ eventKey, matchType }: Props) => {
  const type = matchType === 'qm' ? 'Quals' : matchNames[matchType]
  const eventInfo = useEventInfo(eventKey)
  const eventMatches = useEventMatches(eventKey)
  const matchesInGroup =
    eventMatches &&
    eventMatches
      .filter(m => getMatchType(m.key) === matchType)
      .sort(compareMatches)

  const [query, setQuery] = useState(getCurrentUrlQuery().query || '')
  const updateQuery = (newQuery: string) => {
    const newQueryStr = newQuery
      ? encode({ ...getCurrentUrlQuery(), query: newQuery }, '?')
      : ''

    history.replaceState(null, '', window.location.pathname + newQueryStr)
    setQuery(newQuery)
  }

  const eventName = eventInfo ? ` @ ${eventInfo.name}` : ''

  return (
    <Page
      name={`${type}${eventName}`}
      back={`/events/${eventKey}`}
      class={matchGroupStyle}
    >
      <TextInput label="Search" onInput={updateQuery} value={query} />
      <UnstyledList class={matchListStyle}>
        {matchesInGroup ? (
          matchesInGroup.map(m => (
            <li
              key={m.key}
              style={matchMatchesQuery(m, query) ? {} : { display: 'none' }}
            >
              <MatchCard
                href={`/events/${eventKey}/match/${m.key}`}
                match={m}
              />
            </li>
          ))
        ) : (
          <Spinner />
        )}
      </UnstyledList>
    </Page>
  )
}

export default EventMatchGroup
