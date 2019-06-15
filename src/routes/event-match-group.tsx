import { h } from 'preact'
import Page from '@/components/page'
import { matchNames, MatchType, getMatchType } from '@/utils/match-type'
import { useEventInfo } from '@/cache/events'
import { useEventMatches } from '@/cache/matches'
import { MatchCard, matchCardWidth } from '@/components/match-card'
import { compareMatches } from '@/utils/compare-matches'
import { UnstyledList } from '@/components/unstyled-list'
import { useState } from 'preact/hooks'
import TextInput from '@/components/text-input'
import { css } from 'linaria'
import { decode, encode } from 'qss'

interface Props {
  eventKey: string
  matchType: MatchType
}

const searchStyles = css`
  margin-left: auto;
  margin-right: auto;
  width: ${matchCardWidth};
  display: block;
`

const getCurrentUrlQuery = () => decode(window.location.search.substr(1))

const EventMatchGroup = ({ eventKey, matchType }: Props) => {
  const type = matchType === 'qm' ? 'Quals' : matchNames[matchType]
  const eventInfo = useEventInfo(eventKey)
  const eventMatches = useEventMatches(eventKey) || []
  const matchesInGroup = eventMatches.filter(
    m => getMatchType(m.key) === matchType,
  )

  const [query, setQuery] = useState(getCurrentUrlQuery().query || '')
  const updateQuery = (newQuery: string) => {
    const newQueryStr = newQuery
      ? encode({ ...getCurrentUrlQuery(), query: newQuery }, '?')
      : ''

    history.replaceState(null, '', window.location.pathname + newQueryStr)
    setQuery(newQuery)
  }

  const filteredMatches = query
    ? matchesInGroup.filter(
        m =>
          m.key.includes(query) ||
          m.redAlliance.includes('frc' + query) ||
          m.blueAlliance.includes('frc' + query),
      )
    : matchesInGroup

  const eventName = eventInfo ? ` @ ${eventInfo.name}` : ''

  return (
    <Page name={`${type}${eventName}`} back={`/events/${eventKey}`}>
      <TextInput
        labelClass={searchStyles}
        label="Search"
        onInput={updateQuery}
        value={query}
      />
      <UnstyledList>
        {filteredMatches.sort(compareMatches).map(m => (
          <li key={m.key}>
            <MatchCard href={`/events/${eventKey}/match/${m.key}`} match={m} />
          </li>
        ))}
      </UnstyledList>
    </Page>
  )
}

export default EventMatchGroup
