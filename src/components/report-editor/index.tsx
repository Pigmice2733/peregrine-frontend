import { css } from 'linaria'
import { StatDescription, ReportStatDescription } from '@/api/schema'
import { h } from 'preact'
import { useState, useMemo, useEffect } from 'preact/hooks'
import { uploadReport, saveReportLocally } from '@/api/report/submit-report'
import { formatTeamNumber } from '@/utils/format-team-number'
import TeamPicker from '../team-picker'
import FieldCard from '../field-card'
import TextInput from '../text-input'
import Button from '../button'
import { Report, Field } from '@/api/report'
import { useSchema } from '@/cache/schema/use'
import { SetRequired } from 'type-fest'
import { useEventInfo } from '@/cache/event-info/use'
import { useMatchInfo } from '@/cache/match-info/use'

const scoutStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`

const commentStyles = css`
  width: 25rem;
  max-width: 80%;
`
const buttonStyles = css`
  margin: 1rem;
`

interface Props {
  initialReport: SetRequired<Partial<Report>, 'eventKey'>
  onSaveSuccess: (report: Report) => void
  onSaveLocally?: (report: Report) => void
}

const isFieldReportable = (
  field: StatDescription,
): field is ReportStatDescription => field.reportReference !== undefined
const isAuto = (field: ReportStatDescription) => field.period === 'auto'
const isTeleop = (field: ReportStatDescription) => field.period === 'teleop'

// Number properties default to 0 and boolean properties default to 0 which represents false
const defaultFieldValue = 0

export const ReportEditor = ({
  initialReport,
  onSaveLocally,
  onSaveSuccess,
}: Props) => {
  const eventKey = initialReport.eventKey
  const [team, setTeam] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [matchKey] = useState<string | undefined>(initialReport.matchKey)
  const [comment, setComment] = useState('')
  const schemaId = useEventInfo(eventKey)?.schemaId
  const schema = useSchema(schemaId)?.schema
  const match = useMatchInfo(eventKey, matchKey)

  const [reportData, setReportData] = useState<Report['data']>(
    initialReport.data || [],
  )
  const updateReportField = (fieldName: string) => (value: number) =>
    setReportData((reportData) =>
      reportData.map(
        (f): Field => (f.name === fieldName ? { name: fieldName, value } : f),
      ),
    )

  const getReportFieldValue = (statDescription: ReportStatDescription) => {
    const matchingField = reportData.find(
      (f) => f.name === statDescription.reportReference,
    )
    if (matchingField) return matchingField.value
    return defaultFieldValue
  }

  const visibleFields = useMemo(() => schema?.filter(isFieldReportable), [
    schema,
  ])

  const blueAlliance = match?.blueAlliance
  const redAlliance = match?.redAlliance

  useEffect(() => {
    if (!visibleFields) return
    setReportData((reportData) =>
      visibleFields.map(
        (statDescription) =>
          reportData.find(
            (f) => f.name === statDescription.reportReference,
          ) || {
            name: statDescription.reportReference,
            value: defaultFieldValue,
          },
      ),
    )
  }, [visibleFields])

  /** Returns the Report if all the required fields are filled in, false otherwise */
  const getReportIfValid = (): Report | false => {
    if (!matchKey || !team) return false
    return {
      eventKey,
      matchKey,
      comment,
      data: reportData,
      teamKey: team,
    }
  }
  const report = getReportIfValid()

  const submit = (e: Event) => {
    e.preventDefault()
    if (!report) return
    setIsSaving(true)
    uploadReport(report)
      .then(() => {
        onSaveSuccess(report)
      })
      .catch(() => {
        saveReportLocally(report)
        if (onSaveLocally) onSaveLocally(report)
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  return (
    <form class={scoutStyles} onSubmit={submit}>
      <h1>Scout {team && formatTeamNumber(team)}</h1>
      {blueAlliance && redAlliance && (
        <TeamPicker
          onChange={setTeam}
          blueAlliance={blueAlliance}
          redAlliance={redAlliance}
        />
      )}
      <h2>Auto</h2>
      {visibleFields?.filter(isAuto).map((stat) => (
        <FieldCard
          key={'auto' + stat.reportReference}
          statDescription={stat}
          value={getReportFieldValue(stat)}
          onChange={updateReportField(stat.reportReference)}
        />
      ))}
      <h2>Teleop</h2>
      {visibleFields?.filter(isTeleop).map((stat) => (
        <FieldCard
          key={'teleop' + stat.reportReference}
          statDescription={stat}
          value={getReportFieldValue(stat)}
          onChange={updateReportField(stat.reportReference)}
        />
      ))}
      <TextInput class={commentStyles} label="Comments" onInput={setComment} />
      <Button disabled={isSaving || !report} class={buttonStyles}>
        {isSaving ? 'Saving Report' : 'Save Report'}
      </Button>
    </form>
  )
}
