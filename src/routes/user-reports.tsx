import Page from 'src/components/page'
import { usePromise } from 'src/utils/use-promise'
import { getReports } from 'src/api/report/get-reports'
import Loader from 'src/components/loader'
import Card from 'src/components/card'
import { css } from '@linaria/core'
import { formatMatchKeyShort } from 'src/utils/format-match-key-short'
import { GetReport } from 'src/api/report'
import { useEventInfo } from 'src/cache/event-info/use'
import { formatTeamNumber } from 'src/utils/format-team-number'
import { getFastestUser } from 'src/cache/users/get-fastest'

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
      back={`/users/${userId}`}
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
