import { h, FunctionComponent } from 'preact'
import Page from '@/components/page'
import { usePromise } from '@/utils/use-promise'
import { getEventStats } from '@/api/stats/get-event-stats'
import { useEventInfo } from '@/cache/event-info/use'
import AnalysisTable from '@/components/analysis-table'
import Spinner from '@/components/spinner'
import { css } from 'linaria'
import { useSchema } from '@/cache/schema/use'
import {
  tablePageStyle,
  tablePageWrapperStyle,
  tablePageTableStyle,
} from '@/utils/table-page-style'

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
        <AnalysisTable
          class={tablePageTableStyle}
          teams={eventStats}
          schema={schema}
          renderTeam={team => (
            <a class={teamStyle} href={`/events/${eventKey}/teams/${team}`}>
              {team}
            </a>
          )}
        />
      ) : (
        <Spinner />
      )}
    </Page>
  )
}

export default EventAnalysis
