import { Report } from 'src/api/report'
import { formatTeamNumber } from 'src/utils/format-team-number'
import Button from './button'
import { useSchema } from 'src/cache/schema/use'
import { useEventInfo } from 'src/cache/event-info/use'
import { StatDescription } from 'src/api/schema'
import { BooleanDisplay } from './boolean-display'
import { formatMatchKeyShort } from 'src/utils/format-match-key-short'
import TeamPicker from './team-picker'
import { useMatchInfo } from 'src/cache/match-info/use'
import { CommentCard } from './comment-card'
import { css } from '@linaria/core'
import { cleanFieldName } from 'src/utils/clean-field-name'
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
      >
        {`${cleanFieldName(field.name)}: `}
      </div>
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

// viewing a report on the report page
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
      {/* links to team, match, and event pages */}
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

      {/* teams in match */}
      <div>
        {matchInfo && (
          <TeamPicker
            redAlliance={matchInfo.redAlliance}
            blueAlliance={matchInfo.blueAlliance}
            value={report.teamKey}
            editable={false}
          />
        )}
      </div>

      <div class={fieldValuesStyle}>
        {/* scores for each match detail */}
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
        // the comment portion of the report
        <CommentCard
          report={report}
          showReporter={false}
          linkToReport={false}
        />
      )}

      {/* links to the author of the report */}
      <ProfileLink reporterId={reporterId} />
      {onEditClick && <Button onClick={onEditClick}>Edit</Button>}
    </>
  )
}
