import { css } from 'linaria'
import { Schema, StatDescription, ReportStatDescription } from '@/api/schema'
import { ProcessedMatchInfo } from '@/api/match-info'
import { FunctionComponent, h } from 'preact'
import { useState, useEffect, useMemo } from 'preact/hooks'
import { submitReport } from '@/api/report/submit-report'
import { submitComment } from '@/api/report/submit-comment'
import { formatTeamNumber } from '@/utils/format-team-number'
import TeamPicker from '../team-picker'
import FieldCard from '../field-card'
import TextInput from '../text-input'
import Button from '../button'
import { noop } from '@/utils/empty-promise'
import { useErrorEmitter } from '../error-boundary'
import { Report, Field } from '@/api/report'

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
  eventKey: string
  matchKey: string
  schema: Schema
  match: ProcessedMatchInfo
  /** Callback to be called whenever the report is saved */
  onSaveSuccess?: () => void
  initialReport?: Report
}

const emptyReport: Report = {
  data: [],
}

const isFieldReportable = (
  field: StatDescription,
): field is ReportStatDescription => field.reportReference !== undefined
const isAuto = (field: ReportStatDescription) => field.period === 'auto'
const isTeleop = (field: ReportStatDescription) => field.period === 'teleop'

export const ReportEditor: FunctionComponent<Props> = ({
  eventKey,
  matchKey,
  schema,
  match,
  onSaveSuccess = noop,
  initialReport = emptyReport,
}) => {
  const [team, setTeam] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [comment, setComment] = useState<string | undefined>(undefined)
  const [report, setReport] = useState<Report>(initialReport)
  const emitError = useErrorEmitter()

  const isReady = team !== null

  const updateReportField = (fieldName: string) => (value: number | boolean) =>
    setReport(report => ({
      data: report.data.map(
        (f): Field => (f.name === fieldName ? { name: fieldName, value } : f),
      ),
    }))

  const getFieldDefault = (statDescription: ReportStatDescription) =>
    statDescription.type === 'boolean' ? false : 0

  const getReportFieldValue = (statDescription: ReportStatDescription) => {
    const matchingField = report.data.find(
      f => f.name === statDescription.reportReference,
    )
    if (matchingField) return matchingField.value
    return getFieldDefault(statDescription)
  }

  const visibleFields = useMemo(() => schema.schema.filter(isFieldReportable), [
    schema,
  ])

  const autoFields = visibleFields.filter(isAuto)
  const teleopFields = visibleFields.filter(isTeleop)

  useEffect(() => {
    setReport(report => ({
      data: visibleFields.map(
        statDescription =>
          report.data.find(f => f.name === statDescription.reportReference) || {
            name: statDescription.reportReference,
            value: getFieldDefault(statDescription),
          },
      ),
    }))
  }, [visibleFields])

  const onSubmit = async (e: Event) => {
    e.preventDefault()
    if (!team) return
    setIsSaving(true)
    try {
      const reportPromise = submitReport(eventKey, matchKey, team, report)
      if (comment) await submitComment(eventKey, matchKey, team, { comment })
      await reportPromise
    } catch (error) {
      emitError(error)
    } finally {
      setIsSaving(false)
    }
    onSaveSuccess()
  }

  return (
    <form class={scoutStyles} onSubmit={onSubmit}>
      <h1>Scout {team && formatTeamNumber(team)}</h1>

      <TeamPicker
        onChange={setTeam}
        blueAlliance={match.blueAlliance}
        redAlliance={match.redAlliance}
      />
      <h2>Auto</h2>
      {autoFields.map(stat => (
        <FieldCard
          key={'auto' + stat.reportReference}
          statDescription={stat}
          value={getReportFieldValue(stat)}
          onChange={updateReportField(stat.reportReference)}
        />
      ))}
      <h2>Teleop</h2>
      {teleopFields.map(stat => (
        <FieldCard
          key={'teleop' + stat.reportReference}
          statDescription={stat}
          value={getReportFieldValue(stat)}
          onChange={updateReportField(stat.reportReference)}
        />
      ))}
      <TextInput class={commentStyles} label="Comments" onInput={setComment} />
      <Button disabled={isSaving || !isReady} class={buttonStyles}>
        {isSaving ? 'Saving Report' : 'Save Report'}
      </Button>
    </form>
  )
}
