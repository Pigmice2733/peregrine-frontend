import { h, Fragment } from 'preact'
import { GetReport } from '@/api/report'
import { formatTeamNumber } from '@/utils/format-team-number'
import Icon from './icon'
import { mdiAccountCircle } from '@mdi/js'
import { getUser } from '@/api/user/get-user'
import { usePromise } from '@/utils/use-promise'
import { formatUserName } from '@/utils/format-user-name'

interface Props {
  report: GetReport
}

export const ReportViewer = ({ report }: Props) => {
  const reporterId = report.reporterId
  const reporter = usePromise(() => {
    if (reporterId !== undefined) {
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
    </Fragment>
  )
}
