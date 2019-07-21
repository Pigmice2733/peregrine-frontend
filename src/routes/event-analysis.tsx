import { h } from 'preact'
import Page from '@/components/page'
import { usePromise } from '@/utils/use-promise'
import { getEventStats } from '@/api/stats/get-event-stats'
import { useEventInfo } from '@/cache/events'
import { getSchema } from '@/api/schema/get-schema'
import AnalysisTable from '@/components/analysis-table'
import Spinner from '@/components/spinner'
import { css } from 'linaria'

interface Props {
  eventKey: string
}

const analysisPageStyle = css`
  padding: 1rem;
  overflow: hidden;

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

const EventAnalysis = ({ eventKey }: Props) => {
  const eventStats = usePromise(() => getEventStats(eventKey), [eventKey])
  const eventInfo = useEventInfo(eventKey)
  const eventName = eventInfo && eventInfo.name
  const schema = usePromise(
    () =>
      eventInfo ? getSchema(eventInfo.schemaId) : Promise.resolve(undefined),
    [eventKey, eventInfo],
  )

  return (
    <Page
      name={`Analysis - ${eventName || eventKey}`}
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
