import { h, Fragment } from 'preact'
import { GetReport } from '@/api/report'
import { formatTeamNumber } from '@/utils/format-team-number'
import Icon from './icon'
import { mdiAccountCircle } from '@mdi/js'
import { getUser } from '@/api/user/get-user'
import { usePromise } from '@/utils/use-promise'
import { formatUserName } from '@/utils/format-user-name'
import Button from './button'
import { useSchema } from '@/cache/schema/use'
import { useEventInfo } from '@/cache/event-info/use'
import { StatDescription } from '@/api/schema'
import { BooleanDisplay } from './boolean-display'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'

interface Props {
  report: GetReport
  onEditClick?: () => void
}
// What we want to display
// xReporter name
// -Reporter realm
// xTeam num
// x-Auto
// x-Teleop
// xEvent
// xMatch
// -Opponents/Alliance members
// xComment
// xEdit button (if they can edit)

const ReportFieldViewer = ({
  field,
  report,
}: {
  field: StatDescription
  report: GetReport
}) => {
  const value =
    report.data.find((data) => data.name === field.reportReference)?.value ??
    '?'
  return (
    <div>
      {`${field.name}: `}
      {field.type === 'boolean' ? (
        <BooleanDisplay value={Boolean(value)} />
      ) : (
        value
      )}
    </div>
  )
}
// http://localhost:2733/reports/4086

export const ReportViewer = ({ report, onEditClick }: Props) => {
  const reporterId = report.reporterId
  const reporter = usePromise(() => {
    if (reporterId !== undefined && reporterId !== null) {
      return getUser(reporterId).catch(() => undefined)
    }
  }, [reporterId])
  const eventInfo = useEventInfo(report.eventKey)

  const schema = useSchema(eventInfo?.schemaId)
  const displayableFields = schema?.schema.filter(
    (field) => field.reportReference !== undefined,
  )
  const autoFields = displayableFields?.filter(
    (field) => field.period === 'auto',
  )
  const teleopFields = displayableFields?.filter(
    (field) => field.period === 'teleop',
  )
  return (
    <Fragment>
      <div>
        <a
          href={`/events/${report.eventKey}/teams/${formatTeamNumber(
            report.teamKey,
          )}`}
        >{`team: ${formatTeamNumber(report.teamKey)}`}</a>
      </div>
      <div>
        <a href={`/events/${report.eventKey}`}>{`event: ${
          eventInfo?.name ?? report.eventKey
        }`}</a>
      </div>
      <div>
        <a
          href={`/events/${report.eventKey}/matches/${report.matchKey}`}
        >{`match: ${formatMatchKeyShort(report.matchKey)}`}</a>
      </div>
      <div>{report.comment}</div>
      <div>
        <Icon icon={mdiAccountCircle} />
        {formatUserName(reporter)}
      </div>
      {onEditClick && <Button onClick={onEditClick}>Edit</Button>}
      <h3>Auto</h3>
      {autoFields?.map((field) => (
        <ReportFieldViewer field={field} report={report} key={field.name} />
      ))}
      <h3>Teleop</h3>
      {teleopFields?.map((field) => (
        <ReportFieldViewer field={field} report={report} key={field.name} />
      ))}
    </Fragment>
  )
}

// http://localhost:2733/reports/2911
