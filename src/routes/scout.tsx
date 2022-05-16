import Page from '@/components/page'
import Authenticated from '@/components/authenticated'
import { ReportEditor } from '@/components/report-editor'
import { route } from '@/router'
import { AlertType } from '@/components/alert'
import { css } from 'linaria'

interface Props {
  eventKey: string
  matchKey: string
}

const scoutPageStyle = css`
  display: flex;
  padding: 2rem;
  justify-content: center;
`

const ScoutPage = ({ eventKey, matchKey }: Props) => {
  const matchUrl = `/events/${eventKey}/matches/${matchKey}`

  return (
    <Authenticated
      label="Log In to Scout"
      render={() => (
        <Page name="Scout" back={matchUrl} class={scoutPageStyle}>
          <ReportEditor
            initialReport={{ eventKey, matchKey }}
            onMatchSelect={(newMatchKey) =>
              history.replaceState(
                null,
                '',
                `/events/${eventKey}/matches/${newMatchKey}/scout`,
              )
            }
            onSaveSuccess={(report) =>
              route(matchUrl, {
                type: AlertType.Success,
                message: (
                  <>
                    {'Report was saved successfully! '}
                    <a href={`/reports/${report.id}`}>View Report</a>
                  </>
                ),
              })
            }
            onSaveLocally={(report) =>
              route(matchUrl, {
                type: AlertType.Success,
                message: (
                  <>
                    {'Report was saved locally! '}
                    <a href={`/saved-reports/${report.key}`}>View Report</a>
                  </>
                ),
              })
            }
          />
        </Page>
      )}
    />
  )
}

export default ScoutPage
