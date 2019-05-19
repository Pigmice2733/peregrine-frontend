import { h } from 'preact'
import Page from '@/components/page'
import { formatMatchKey } from '@/utils/format-match-key'
import LoadData from '@/load-data'
import { MatchCard } from '@/components/match-card'
import Spinner from '@/components/spinner'
import Button from '@/components/button'
import style from './style.css'
import AnalysisTable from '@/components/analysis-table'
import { getSchema } from '@/api/schema/get-schema'
import { getEventStats } from '@/api/stats/get-event-stats'
import clsx from 'clsx'
import { useEventInfo } from '@/cache/event-info'
import { getEventMatchInfo } from '@/api/match-info/get-event-match-info'
import { usePromise } from '@/utils/use-promise'

interface Props {
  eventKey: string
  matchKey: string
}

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
      <div class={style.match}>
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
                        style.tableTeam,
                        matchInfo.redAlliance.includes('frc' + team)
                          ? style.red
                          : style.blue,
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
