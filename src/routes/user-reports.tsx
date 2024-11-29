import Page from '@/components/page'
import { usePromise } from '@/utils/use-promise'
import { getReports } from '@/api/report/get-reports'
import Loader from '@/components/loader'
import Card from '@/components/card'
import { css } from '@linaria/core'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'
import { GetReport } from '@/api/report'
import { useEventInfo } from '@/cache/event-info/use'
import { formatTeamNumber } from '@/utils/format-team-number'
import { getFastestUser } from '@/cache/users/get-fastest'

interface Props {
  userId: string
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
  console.log(userId)
  const reports = usePromise(() => getReports({ reporter: userId }), [userId])
  const user = usePromise(
    () => getFastestUser(Number(userId)).catch(() => {}),
    [userId],
  )
  return (
    <Page
      name={`${
        user ? `${user.firstName} ${user.lastName}` : `User ${userId}`
      }: Reports`}
      class={userReportsStyle}
    >
      {reports ? (
        reports.map((report) => {
          return <ReportCard key={report.id} report={report} />
        })
      ) : (
        <Loader />
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
