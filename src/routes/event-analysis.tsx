import { FunctionComponent } from 'preact'
import Page from 'src/components/page'
import { usePromise } from 'src/utils/use-promise'
import { getEventStats } from 'src/api/stats/get-event-stats'
import { useEventInfo } from 'src/cache/event-info/use'
import AnalysisTable from 'src/components/analysis-table'
import Loader from 'src/components/loader'
import { css } from '@linaria/core'
import { useSchema } from 'src/cache/schema/use'
import {
  tablePageStyle,
  tablePageWrapperStyle,
  tablePageTableStyle,
} from 'src/utils/table-page-style'
import Card from 'src/components/card'

interface Props {
  eventKey: string
}

const teamStyle = css`
  color: inherit;
`

const EventAnalysis: FunctionComponent<Props> = ({ eventKey }) => {
  const eventStats = usePromise(() => getEventStats(eventKey), [eventKey])
  const eventInfo = useEventInfo(eventKey)

  const schema = useSchema(eventInfo?.schemaId)

  return (
    <Page
      name={`Analysis - ${eventInfo ? eventInfo.name : eventKey}`}
      back={`/events/${eventKey}`}
      class={tablePageStyle}
      wrapperClass={tablePageWrapperStyle}
    >
      {eventStats && schema ? (
        eventStats.length === 0 ? (
          'No Event Data'
        ) : (
          <Card class={tablePageTableStyle}>
            <AnalysisTable
              eventKey={eventKey}
              teams={eventStats}
              schema={schema}
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
