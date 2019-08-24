import { h, Fragment } from 'preact'
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
  const schema = useSchema(event && event.schemaId)

  // Fragment is a workaround to a preact bug
  // without it, when you change away from this route, it sticks around behind the new route
  return (
    <Fragment>
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
    </Fragment>
  )
}

export default ScoutPage
