import { h } from 'preact'
import Page from '@/components/page'
import { MatchCard } from '@/components/match-card'
import Spinner from '@/components/spinner'
import { getEventMatches } from '@/api/match-info/get-event-matches'
import { getSchema } from '@/api/schema/get-schema'
import AnalysisTable from '@/components/analysis-table'
import { getEventStats } from '@/api/stats/get-event-stats'
import { usePromise } from '@/utils/use-promise'
import { useEventInfo, getFastestEventInfo } from '@/cache/event-info'
import { css } from 'linaria'
import { EventInfoCard } from '@/components/event-info-card'

interface Props {
  eventKey: string
}

const noMatches = css`
  display: flex;
  justify-content: center;
  padding: 2rem;
  opacity: 0.5;
`

const eventStyle = css`
  display: flex;
  flex-direction: column;
  --spacing: 1rem;
  padding: calc(var(--spacing) / 2) 2rem;

  & > * {
    margin: calc(var(--spacing) / 2) auto;
  }
`

const Event = ({ eventKey }: Props) => {
  const matches = usePromise(() => getEventMatches(eventKey), [eventKey])
  const eventInfo = useEventInfo(eventKey)
  const eventStats = usePromise(() => getEventStats(eventKey), [eventKey])
  const schema = usePromise(
    () => getFastestEventInfo(eventKey).then(e => getSchema(e.schemaId)),
    [eventKey],
  )

  return (
    <Page
      name={(eventInfo && eventInfo.name) || <code>{eventKey}</code>}
      back="/"
      class={eventStyle}
    >
      {eventInfo && <EventInfoCard event={eventInfo} />}
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
      {matches ? (
        matches.length === 0 ? (
          <div class={noMatches}>No matches yet</div>
        ) : (
          matches.map(m => (
            <MatchCard
              key={m.key}
              match={m}
              href={`/events/${eventKey}/matches/${m.key}`}
            />
          ))
        )
      ) : (
        <Spinner />
      )}
    </Page>
  )
}

export default Event
