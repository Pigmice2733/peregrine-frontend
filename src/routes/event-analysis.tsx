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

const EventAnalysis: FunctionComponent<Props> = ({ eventKey }) => {
  const eventInfo = useEventInfo(eventKey)
  const eventYear = eventInfo ? eventInfo.startDate.getFullYear() : 0
  const eventStats = usePromise(() => getEventStats(eventKey, eventYear), [
    eventKey,
    eventYear,
  ])
  const eventName = eventInfo ? eventInfo.name : eventKey

  const now = new Date()
  const eventNotStarted = eventInfo
    ? now.getTime() < eventInfo.startDate.getTime()
    : true

  const schema = useSchema(eventNotStarted ? undefined : eventInfo?.schemaId)

  let teamList = ''
  if (eventStats) {
    for (let i = 0; i < eventStats?.length; i++) {
      teamList += eventStats[i].team + `, `
    }
    teamList = teamList.slice(0, -2)
  }
  if (teamList === '') {
    teamList = `This event has no teams.`
  }

  return (
    <Page
      name={`Analysis - ${eventName}`}
      back={`/events/${eventKey}`}
      class={eventNotStarted ? noTablePageStyle : tablePageStyle}
      wrapperClass={tablePageWrapperStyle}
    >
      {eventStats ? (
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
          <>
            <div
              class={css`
                text-decoration-line: underline;
              `}
            >
              Teams in {eventName}:
            </div>
            <br />
            {teamList}
          </>
        )
      ) : eventNotStarted ? (
        `This event hasn't started yet.`
      ) : (
        <Loader />
      )}
    </Page>
  )
}

export default EventAnalysis
