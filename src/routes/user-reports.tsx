import Page from '@/components/page'
import { usePromise } from '@/utils/use-promise'
import { getReports } from '@/api/report/get-reports'
import Spinner from '@/components/spinner'
import Card from '@/components/card'
import { css } from 'linaria'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'
import { GetReport } from '@/api/report'
import { useEventInfo } from '@/cache/event-info/use'
import { formatTeamNumber } from '@/utils/format-team-number'
import { getUser } from '@/api/user/get-user'

interface Props {
  userId: number
}

const userReportsStyle = css`
  display: grid;
  justify-items: center;
  grid-gap: 1.5rem;
  padding: 1.5rem;
`

const reportCardStyle = css`
  width: 20rem;
  padding: 1rem;
`

const UserReports = ({ userId }: Props) => {
  const reports = usePromise(() => getReports({ reporter: userId }), [userId])
  const user = usePromise(() => getUser(userId).catch(() => {}), [userId])
  return (
    <Page
      name={`${
        user ? `${user.firstName} ${user.lastName}` : `User ${userId}`
      }: Reports`}
      back={`/users/${userId}`}
      class={userReportsStyle}
    >
      {reports ? (
        reports.map((report) => {
          return <ReportCard key={report.id} report={report} />
        })
      ) : (
        <Spinner />
      )}
    </Page>
  )
}

const ReportCard = ({ report }: { report: GetReport }) => {
  const event = useEventInfo(report.eventKey)
  return (
    <Card class={reportCardStyle} href={`/reports/${report.id}`}>
      {formatTeamNumber(report.teamKey)}
      {' in '}
      {formatMatchKeyShort(report.matchKey)}
      {event ? ` at ${event.name}` : undefined}
    </Card>
  )
}

export default UserReports
