import { ProcessedMatchInfo } from '@/api/match-info'
import { Fragment, h } from 'preact'
import TextInput from './text-input'
import { compareMatches as compareMatchesChronologically } from '@/utils/compare-matches'
import { MatchCard } from './match-card'
import Spinner from './spinner'
import { useState } from 'preact/hooks'
import { css } from 'linaria'
import { formatMatchKey } from '@/utils/format-match-key'

interface Props {
  matches: ProcessedMatchInfo[]
  eventKey: string
}

const searchTextStyles = css`
  margin: 0;
`

const matchListStyle = css`
  display: grid;
  grid-gap: 1.1rem;
`

const enum QueryRank {
  NoMatch,
  TeamLoose,
  TeamExact,
  MatchLoose,
  MatchExact,
}

export const EventMatches = ({ matches, eventKey }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const s = searchQuery.trim().toLowerCase()

  const getQueryRank = (m: ProcessedMatchInfo) => {
    if (
      s === m.key ||
      'qm' + s === m.key ||
      s === formatMatchKey(m.key).group.toLowerCase()
    )
      return QueryRank.MatchExact
    if (
      m.key.includes(s) ||
      formatMatchKey(m.key)
        .group.toLowerCase()
        .includes(s)
    )
      return QueryRank.MatchLoose
    // If all of the query is digits
    if (Number(s).toString() === s) {
      const teams = [...m.redAlliance, ...m.blueAlliance].map(t =>
        t.replace(/frc/, ''),
      )
      if (teams.includes(s)) return QueryRank.TeamExact
      if (teams.some(t => t.includes(s))) return QueryRank.TeamLoose
    }
    return QueryRank.NoMatch
  }

  const sortedMatches = matches
    .map(match => ({
      match,
      queryRank: getQueryRank(match),
    }))
    .filter(m => m.queryRank !== QueryRank.NoMatch)
    .sort((a, b) => {
      return (
        b.queryRank - a.queryRank ||
        compareMatchesChronologically(a.match, b.match)
      )
    })

  console.log(sortedMatches)

  const filteredMatches = s
    ? sortedMatches.map(m => m.match)
    : matches.sort(compareMatchesChronologically)

  return (
    <Fragment>
      <TextInput
        labelClass={searchTextStyles}
        label="Search"
        onInput={setSearchQuery}
      />
      {matches ? (
        <div class={matchListStyle}>
          {filteredMatches.map(m => (
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
