import { h } from 'preact'
import Page from '@/components/page'
import Authenticated from '@/components/authenticated'
import { ReportEditor } from '@/components/report-editor'
import { route } from '@/router'

interface Props {
  eventKey: string
  matchKey: string
}

const ScoutPage = ({ eventKey, matchKey }: Props) => {
  return (
    <Authenticated
      label="Log In to Scout"
      render={() => (
        <Page name="Scout" back={`/events/${eventKey}/matches/${matchKey}`}>
          <ReportEditor
            initialReport={{ eventKey, matchKey }}
            onSaveSuccess={() =>
              route(`/events/${eventKey}/matches/${matchKey}`)
            }
          />
        </Page>
      )}
    />
  )
}

export default ScoutPage
