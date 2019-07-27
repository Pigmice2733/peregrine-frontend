import { h, FunctionComponent } from 'preact'
import Page from '@/components/page'
import { usePromise } from '@/utils/use-promise'
import { getEventStats } from '@/api/stats/get-event-stats'
import { useEventInfo } from '@/cache/events'
import AnalysisTable from '@/components/analysis-table'
import Spinner from '@/components/spinner'
import { css } from 'linaria'
import { useSchema } from '@/cache/schemas'

interface Props {
  eventKey: string
}

const analysisPageStyle = css`
  padding: 1rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  @media (max-width: 600px) {
    padding: 0;
  }
`

const analysisTableStyle = css`
  height: 100%;
`

const wrapperStyle = css`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const EventAnalysis: FunctionComponent<Props> = ({ eventKey }) => {
  const eventStats = usePromise(() => getEventStats(eventKey), [eventKey])
  const eventInfo = useEventInfo(eventKey)

  const schema = useSchema(eventInfo && eventInfo.schemaId)

  return (
    <Page
      name={`Analysis - ${eventInfo ? eventInfo.name : eventKey}`}
      back={`/events/${eventKey}`}
      class={analysisPageStyle}
      wrapperClass={wrapperStyle}
    >
      {eventStats && schema ? (
        <AnalysisTable
          class={analysisTableStyle}
          teams={eventStats}
          schema={schema}
          renderTeam={team => (
            <a href={`/events/${eventKey}/teams/${team}`}>{team}</a>
          )}
        />
      ) : (
        <Spinner />
      )}
    </Page>
  )
}

export default EventAnalysis
