import { h } from 'preact'
import Page from '@/components/page'
import Authenticated from '@/components/authenticated'
import Spinner from '@/components/spinner'
import { useMatchInfo } from '@/cache/match-info/use'
import { useSchema } from '@/cache/schema/use'
import { useEventInfo } from '@/cache/event-info/use'
import { ReportEditor } from '@/components/report-editor'
import { route } from '@/router'

interface Props {
  eventKey: string
  matchKey: string
}

const ScoutPage = ({ eventKey, matchKey }: Props) => {
  const match = useMatchInfo(eventKey, matchKey)
  const event = useEventInfo(eventKey)
  const schema = useSchema(event?.schemaId)

  return (
    <Authenticated
      label="Log In to Scout"
      render={() => (
        <Page name="Scout" back={`/events/${eventKey}/matches/${matchKey}`}>
          {match && schema ? (
            <ReportEditor
              eventKey={eventKey}
              matchKey={matchKey}
              match={match}
              schema={schema}
              onSaveSuccess={() =>
                route(`/events/${eventKey}/matches/${matchKey}`)
              }
            />
          ) : (
            <Spinner />
          )}
        </Page>
      )}
    />
  )
}

export default ScoutPage
