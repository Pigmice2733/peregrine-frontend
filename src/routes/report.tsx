import { h } from 'preact'
import Page from '@/components/page'
import { GetReport } from '@/api/report'
import { ReportEditor } from '@/components/report-editor'
import { ReportViewer } from '@/components/report-viewer'
import Card from '@/components/card'
import { css } from 'linaria'

const fakeReport: GetReport = {
  id: 1000,
  eventKey: '2020waspo',
  matchKey: 'qm1',
  teamKey: 'frc2147',
  realmId: 4,
  reporterId: 64,
  comment: 'blah',
  data: [
    {
      name: 'Balls Scored High (auto)',
      value: 2,
    },
    {
      name: 'Balls Scored Low (auto)',
      value: 0,
    },
    {
      name: 'Balls Scored High (teleop)',
      value: 7,
    },
    {
      name: 'Balls Scored Low (teleop)',
      value: 0,
    },
    {
      name: 'Rotation Control',
      value: 0,
    },
    {
      name: 'Position Control',
      value: 0,
    },
    {
      name: 'Runs Through Trench',
      value: 3,
    },
    {
      name: 'Runs Through Rendezvous',
      value: 1,
    },
  ],
}

const reportPageStyle = css`
  display: flex;
  padding: 2rem;
`

const Report = () => {
  return (
    <Page
      name="Report"
      back={() => window.history.back()}
      class={reportPageStyle}
    >
      <Card>
        {/* <ReportEditor initialReport={fakeReport} onSaveSuccess={() => {}} /> */}
        <ReportViewer report={fakeReport} />
      </Card>
    </Page>
  )
}

export default Report
