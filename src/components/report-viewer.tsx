import { Report } from '@/api/report'
import { formatTeamNumber } from '@/utils/format-team-number'
import Button from './button'
import { useSchema } from '@/cache/schema/use'
import { useEventInfo } from '@/cache/event-info/use'
import { StatDescription } from '@/api/schema'
import { BooleanDisplay } from './boolean-display'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'
import TeamPicker from './team-picker'
import { useMatchInfo } from '@/cache/match-info/use'
import { CommentCard } from './comment-card'
import { css } from 'linaria'
import { cleanFieldName } from '@/utils/clean-field-name'
import { ProfileLink } from './profile-link'

interface Props {
  report: Report
  onEditClick?: () => void
}

const nameTypeSeparatorStyle = css`
  display: flex;
  justify-content: space-between;
`

const ReportFieldViewer = ({
  field,
  report,
}: {
  field: StatDescription
  report: Report
}) => {
  const value =
    report.data.find((data) => data.name === field.reportReference)?.value ??
    '?'
  return (
    <div class={nameTypeSeparatorStyle}>
      <div
        class={css`
          margin-right: 1rem;
        `}
      >{`${cleanFieldName(field.name)}: `}</div>
      {field.type === 'boolean' ? (
        <BooleanDisplay value={Boolean(value)} />
      ) : (
        <span>{value}</span>
      )}
    </div>
  )
}

const fieldValuesStyle = css`
  display: grid;
  grid-gap: 1rem;

  & > h3 {
    justify-self: center;
    margin: 0;
  }
`

export const ReportViewer = ({ report, onEditClick }: Props) => {
  const reporterId = report.reporterId
  const eventInfo = useEventInfo(report.eventKey)
  const matchInfo = useMatchInfo(report.eventKey, report.matchKey)
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
    <>
      <div>
        <a
          href={`/events/${report.eventKey}/teams/${formatTeamNumber(
            report.teamKey,
          )}`}
        >{`${formatTeamNumber(report.teamKey)}`}</a>
        {' in '}
        <a
          href={`/events/${report.eventKey}/matches/${report.matchKey}`}
        >{`${formatMatchKeyShort(report.matchKey)}`}</a>
        {' at '}
        <a href={`/events/${report.eventKey}`}>{`${
          eventInfo?.name ?? report.eventKey
        }`}</a>
      </div>
      {matchInfo && (
        <TeamPicker
          redAlliance={matchInfo.redAlliance}
          blueAlliance={matchInfo.blueAlliance}
          value={report.teamKey}
          editable={false}
        />
      )}

      <div class={fieldValuesStyle}>
        <h3>Auto</h3>
        {autoFields?.map((field) => (
          <ReportFieldViewer field={field} report={report} key={field.name} />
        ))}
        <h3>Teleop</h3>
        {teleopFields?.map((field) => (
          <ReportFieldViewer field={field} report={report} key={field.name} />
        ))}
      </div>

      {report.comment && (
        <CommentCard
          report={report}
          showReporter={false}
          linkToReport={false}
        />
      )}

      <ProfileLink reporterId={reporterId} />
      {onEditClick && <Button onClick={onEditClick}>Edit</Button>}
    </>
  )
}
