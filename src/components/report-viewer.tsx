import { h, Fragment } from 'preact'
import { GetReport } from '@/api/report'
import { formatTeamNumber } from '@/utils/format-team-number'
import Icon from './icon'
import { mdiAccountCircle } from '@mdi/js'
import { getUser } from '@/api/user/get-user'
import { usePromise } from '@/utils/use-promise'
import { formatUserName } from '@/utils/format-user-name'
import Button from './button'

interface Props {
  report: GetReport
  onEditClick?: () => void
}
// What we want to display
// -Reporter name
// -Reporter realm
// -Team num
// --Auto
// --Teleop
// -Event
// -Match
// -Opponents/Alliance members
// -Comment
// -Edit button (if they can edit)

export const ReportViewer = ({ report, onEditClick }: Props) => {
  const reporterId = report.reporterId
  const reporter = usePromise(() => {
    if (reporterId !== undefined && reporterId !== null) {
      return getUser(reporterId)
    }
  }, [reporterId])
  return (
    <Fragment>
      <div>{`team: ${formatTeamNumber(report.teamKey)}`}</div>
      <div>
        <Icon icon={mdiAccountCircle} />
        {formatUserName(reporter)}
      </div>
      {onEditClick && <Button onClick={onEditClick}>Edit</Button>}
    </Fragment>
  )
}
