import { h } from 'preact'
import Page from '@/components/page'
import { usePromise } from '@/utils/use-promise'
import { getEventStats } from '@/api/stats/get-event-stats'
import { getFastestEventInfo } from '@/cache/events'
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

  & > * {
    height: 100%;
  }
`

const wrapperStyle = css`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const EventAnalysis = ({ eventKey }: Props) => {
  const eventStats = usePromise(() => getEventStats(eventKey), [eventKey])
  const schema = usePromise(
    () => getFastestEventInfo(eventKey).then(e => getSchema(e.schemaId)),
    [eventKey],
  )
  const eventName = usePromise(
    () => getFastestEventInfo(eventKey).then(e => e.name),
    [eventKey],
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
