import { h } from 'preact'
import Page from '@/components/page'
import { formatMatchKey } from '@/utils/format-match-key'
import LoadData from '@/load-data'
import { MatchCard } from '@/components/match-card'
import Spinner from '@/components/spinner'
import Button from '@/components/button'
import AnalysisTable from '@/components/analysis-table'
import { getSchema } from '@/api/schema/get-schema'
import { getEventStats } from '@/api/stats/get-event-stats'
import clsx from 'clsx'
import { useEventInfo } from '@/cache/event-info'
import { getEventMatchInfo } from '@/api/match-info/get-event-match-info'
import { usePromise } from '@/utils/use-promise'
import { css } from 'linaria'

interface Props {
  eventKey: string
  matchKey: string
}

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
  }

  /* extra selectors for specificity */
  a.${tableTeamStyle}.${redStyle} {
    color: var(--alliance-red);
  }

  a.${tableTeamStyle}.${blueStyle} {
    color: var(--alliance-blue);
  }
`

const EventMatch = ({ eventKey, matchKey }: Props) => {
  const m = formatMatchKey(matchKey)
  const eventInfo = useEventInfo(eventKey)
  const matchInfo = usePromise(() => getEventMatchInfo(eventKey, matchKey), [
    eventKey,
    matchKey,
  ])
  return (
    <Page
      back={`/events/${eventKey}`}
      name={
        m.group +
        (m.num ? ' Match ' + m.num : '') +
        ' - ' +
        (eventInfo ? eventInfo.name : eventKey)
      }
    >
      <div class={matchStyle}>
        <Button href={`/events/${eventKey}/matches/${matchKey}/scout`}>
          Scout Match
        </Button>
        {matchInfo ? <MatchCard match={matchInfo} /> : <Spinner />}
        {eventInfo && (
          <LoadData
            data={{
              schema: () => getSchema(eventInfo.schemaId),
              teams: () => getEventStats(eventKey),
            }}
            renderSuccess={({ schema, teams }) =>
              (matchInfo && schema && teams && (
                <AnalysisTable
                  teams={teams.filter(
                    t =>
                      matchInfo.redAlliance.includes('frc' + t.team) ||
                      matchInfo.blueAlliance.includes('frc' + t.team),
                  )}
                  schema={schema}
                  renderTeam={team => (
                    <a
                      class={clsx(
                        tableTeamStyle,
                        matchInfo.redAlliance.includes('frc' + team)
                          ? redStyle
                          : blueStyle,
                      )}
                      href={`/events/${eventKey}/teams/${team}`}
                    >
                      {team}
                    </a>
                  )}
                />
              )) ||
              null
            }
          />
        )}
      </div>
    </Page>
  )
}

export default EventMatch
