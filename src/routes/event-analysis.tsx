/* eslint-disable caleb/@typescript-eslint/no-unnecessary-condition */
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

interface Props {
  eventKey: string
  year: number
}

const teamStyle = css`
  color: inherit;
`

const noTablePageStyle = css`
  padding: 1rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
`

const EventAnalysis: FunctionComponent<Props> = ({ eventKey, year }) => {
  const eventStats = usePromise(() => getEventStats(eventKey, year), [eventKey])
  const eventInfo = useEventInfo(eventKey)

  const now = new Date()
  const eventNotStarted = eventInfo
    ? now.getTime() < eventInfo.startDate.getTime()
    : true

  const schema = useSchema(eventNotStarted ? undefined : eventInfo?.schemaId)

  return (
    <Page
      name={`Analysis - ${eventInfo ? eventInfo.name : eventKey}`}
      back={`/events/${eventKey}`}
      class={eventNotStarted ? noTablePageStyle : tablePageStyle}
      wrapperClass={tablePageWrapperStyle}
    >
      {eventNotStarted ? (
        'This event has not happened yet. Check back after it starts!'
      ) : eventStats ? (
        schema && eventStats.length > 0 ? (
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
        ) : (
          'No Event Data'
        )
      ) : (
        <Loader />
      )}
    </Page>
  )
}

export default EventAnalysis
