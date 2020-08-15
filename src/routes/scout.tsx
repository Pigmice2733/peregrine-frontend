import { h, Fragment } from 'preact'
import Page from '@/components/page'
import Authenticated from '@/components/authenticated'
import { ReportEditor } from '@/components/report-editor'
import { route } from '@/router'
import { AlertType } from '@/components/alert'
import Button from '@/components/button'

interface Props {
  eventKey: string
  matchKey: string
}

const ScoutPage = ({ eventKey, matchKey }: Props) => {
  const matchUrl = `/events/${eventKey}/matches/${matchKey}`
  const goToMatchPage = () => route(`/events/${eventKey}/matches/${matchKey}`)
  return (
    <Authenticated
      label="Log In to Scout"
      render={() => (
        <Page name="Scout" back={matchUrl}>
          <ReportEditor
            initialReport={{ eventKey, matchKey }}
            onSaveSuccess={(report) =>
              route(matchUrl, {
                type: AlertType.Success,
                message: (
                  <Fragment>
                    Report was saved successfully!{' '}
                    <a href={`/reports/${report.id}`}>View Report</a>
                  </Fragment>
                ),
              })
            }
            onSaveLocally={(report) =>
              route(matchUrl, {
                type: AlertType.Success,
                message: (
                  <Fragment>
                    Report was saved locally!{' '}
                    <a href={`/saved-reports/${report.key}`}>View Report</a>
                  </Fragment>
                ),
              })
            }
            onDelete={goToMatchPage}
          />
        </Page>
      )}
    />
  )
}

export default ScoutPage
