import { ProcessedMatch } from '@/api/match-info'
import { Fragment, h } from 'preact'
import { Dropdown } from './dropdown'
import {
  matchNames,
  matchTypes,
  getMatchType,
  MatchType,
} from '@/utils/match-type'
import TextInput from './text-input'
import { compareMatches } from '@/utils/compare-matches'
import { MatchCard } from './match-card'
import Spinner from './spinner'
import { useState } from 'preact/hooks'
import { css } from 'linaria'

interface Props {
  matches: ProcessedMatch[]
  eventKey: string
}

type FilterType = MatchType | 'Team'

const searchStyles = css`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.7rem;
`

const searchTextStyles = css`
  margin: 0;
`

const matchListStyle = css`
  display: grid;
  grid-gap: 1.1rem;
`

export const EventMatches = ({ matches, eventKey }: Props) => {
  const [filterType, setFilterType] = useState<FilterType>('Team')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const teamQuery = 'frc' + searchQuery
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
    <Fragment>
      <div class={searchStyles}>
        {matchGroups && (
          <Dropdown<FilterType>
            button
            options={['Team', ...matchGroups]}
            getText={g => matchNames[g as MatchType] || g}
            onChange={setFilterType}
          />
        )}
        <TextInput
          labelClass={searchTextStyles}
          label="Search"
          onInput={setSearchQuery}
        />
      </div>
      {matches ? (
        <div class={matchListStyle}>
          {matches
            .filter(m =>
              filterType === 'Team'
                ? searchQuery === '' ||
                  m.redAlliance.some(t => t === teamQuery) ||
                  m.blueAlliance.some(t => t === teamQuery)
                : filterType === getMatchType(m.key) &&
                  m.key.includes(searchQuery),
            )
            .sort(compareMatches)
            .map(m => (
              <MatchCard
                href={`/events/${eventKey}/matches/${m.key}`}
                match={m}
                key={m.key}
              />
            ))}
        </div>
      ) : (
        <Spinner />
      )}
    </Fragment>
  )
}
