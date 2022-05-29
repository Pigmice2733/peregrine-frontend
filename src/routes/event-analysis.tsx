import { FunctionComponent } from 'preact'
import Page from '@/components/page'
import { usePromise } from '@/utils/use-promise'
import { getEventStats } from '@/api/stats/get-event-stats'
import { useEventInfo } from '@/cache/event-info/use'
import AnalysisTable from '@/components/analysis-table'
import Loader from '@/components/loader'
import { css } from 'linaria'
import { useSchema } from '@/cache/schema/use'
import {
  tablePageStyle,
  tablePageWrapperStyle,
  tablePageTableStyle,
} from '@/utils/table-page-style'
import Card from '@/components/card'
import { isData } from '@/utils/is-data'

interface Props {
  eventKey: string
}

const teamStyle = css`
  color: inherit;
`

const EventAnalysis: FunctionComponent<Props> = ({ eventKey }) => {
  const eventStats = usePromise(() => getEventStats(eventKey), [eventKey])
  const eventInfo = useEventInfo(eventKey)

  const schema = useSchema(isData(eventInfo) ? eventInfo.schemaId : undefined)

  return (
    <Page
      name={`Analysis - ${eventInfo ? eventInfo.name : eventKey}`}
      back={`/events/${eventKey}`}
      class={tablePageStyle}
      wrapperClass={tablePageWrapperStyle}
    >
      {isData(eventStats) && schema ? (
        eventStats.length === 0 ? (
          'No Event Data'
        ) : (
          <Card class={tablePageTableStyle}>
            <AnalysisTable
              eventKey={eventKey}
              teams={eventStats}
              schema={isData(schema) ? schema : { id: -1, schema: [] }}
              renderTeam={(team, link) => (
                <a class={teamStyle} href={link}>
                  {team}
                </a>
              )}
            />
          </Card>
        )
      ) : (
        <Loader />
      )}
    </Page>
  )
}

export default EventAnalysis
