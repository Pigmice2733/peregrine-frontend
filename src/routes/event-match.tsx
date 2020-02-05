import { h, Fragment } from 'preact'
import Page from '@/components/page'
import { formatMatchKey } from '@/utils/format-match-key'
import { MatchCard } from '@/components/match-card'
import Spinner from '@/components/spinner'
import Button from '@/components/button'
import AnalysisTable from '@/components/analysis-table'
import { getEventStats } from '@/api/stats/get-event-stats'
import clsx from 'clsx'
import { useEventInfo } from '@/cache/event-info/use'
import { css } from 'linaria'
import { usePromise } from '@/utils/use-promise'
import { useMatchInfo } from '@/cache/match-info/use'
import { useSchema } from '@/cache/schema/use'
import { Dropdown } from '@/components/dropdown'
import { useState, useEffect } from 'preact/hooks'
import Card from '@/components/card'
import { red, blue } from '@/colors'
import { ProcessedMatchInfo } from '@/api/match-info'
import { Schema } from '@/api/schema'
import { getMatchTeamStats } from '@/api/stats/get-match-team-stats'
import { processTeamStats } from '@/api/stats'
import { BooleanDisplay } from '@/components/boolean-display'

interface Props {
  eventKey: string
  matchKey: string
}

const renderColoredTeamCell = (match: ProcessedMatchInfo, eventKey: string) => (
  team: string,
) => (
  <a
    class={clsx(
      tableTeamStyle,
      match.redAlliance.includes('frc' + team) ? redStyle : blueStyle,
    )}
    href={`/events/${eventKey}/teams/${team}`}
  >
    {team}
  </a>
)

const tableTeamStyle = css``

const redStyle = css``
const blueStyle = css``

const matchStyle = css`
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > div, /* increase specificity */
  & > * {
    margin: 1.5rem 0 0 0;
    max-width: 100%;
    overflow-x: auto;
  }

  /* extra selectors for specificity */
  a.${tableTeamStyle}.${redStyle} {
    color: ${red};
  }

  a.${tableTeamStyle}.${blueStyle} {
    color: ${blue};
  }
`

const showMatchResults = 'Match Results'
const showTeamStats = 'Team Stats'

type SelectedDisplay = typeof showMatchResults | typeof showTeamStats

const EventMatch = ({ eventKey, matchKey }: Props) => {
  const m = formatMatchKey(matchKey)
  const event = useEventInfo(eventKey)
  const match = useMatchInfo(eventKey, matchKey)
  const schema = useSchema(event?.schemaId)
  const teams = usePromise(() => getEventStats(eventKey), [eventKey])

  const [selectedDisplay, setSelectedDisplay] = useState<SelectedDisplay>(
    showTeamStats,
  )

  // When the match loads (or changes),
  useEffect(() => {
    if (match && match.blueScore !== undefined && match.redScore !== undefined)
      setSelectedDisplay(showMatchResults)
  }, [match])

  return (
    <Page
      back={`/events/${eventKey}`}
      name={
        m.group +
        (m.num ? ' Match ' + m.num : '') +
        ' - ' +
        (event ? event.name : eventKey)
      }
      class={matchStyle}
    >
      <Button href={`/events/${eventKey}/matches/${matchKey}/scout`}>
        Scout Match
      </Button>
      {match ? <MatchCard match={match} /> : <Spinner />}
      <Dropdown
        onChange={setSelectedDisplay}
        options={[showMatchResults, showTeamStats]}
      />
      {match && selectedDisplay === showTeamStats
        ? schema &&
          teams && (
            <AnalysisTable
              teams={teams.filter(
                t =>
                  match.redAlliance.includes('frc' + t.team) ||
                  match.blueAlliance.includes('frc' + t.team),
              )}
              schema={schema}
              renderTeam={renderColoredTeamCell(match, eventKey)}
            />
          )
        : match && (
            <MatchResults match={match} eventKey={eventKey} schema={schema} />
          )}
    </Page>
  )
}

const matchScoreStyle = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-width: 11rem;
  color: white;
  font-weight: bold;
  justify-content: center;
  text-align: center;
  font-size: 1.5rem;

  & > * {
    padding: 1.5rem 0;
  }
`

const redScoreStyle = css`
  background: ${red};
`
const blueScoreStyle = css`
  background: ${blue};
`

interface MatchResultsProps {
  match: ProcessedMatchInfo
  schema?: Schema
  eventKey: string
}

const MatchResults = ({ match, schema, eventKey }: MatchResultsProps) => {
  const teamsStats = usePromise(
    () =>
      Promise.all(
        [...match.redAlliance, ...match.blueAlliance].map(t =>
          getMatchTeamStats(eventKey, match.key, t).then(processTeamStats),
        ),
      ),
    [match],
  )

  return (
    <Fragment>
      <Card class={matchScoreStyle}>
        <div class={redScoreStyle}>{match.redScore}</div>
        <div class={blueScoreStyle}>{match.blueScore}</div>
      </Card>
      {schema && teamsStats && (
        <AnalysisTable
          teams={teamsStats}
          schema={schema}
          renderTeam={renderColoredTeamCell(match, eventKey)}
          renderBoolean={cell => <BooleanDisplay value={cell.avg === 1} />}
          enableSettings={false}
        />
      )}
    </Fragment>
  )
}

export default EventMatch
