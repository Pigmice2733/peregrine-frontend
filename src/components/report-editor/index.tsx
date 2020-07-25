import { css } from 'linaria'
import { StatDescription, ReportStatDescription } from '@/api/schema'
import { h } from 'preact'
import { useState, useMemo, useEffect } from 'preact/hooks'
import {
  uploadReport,
  saveReportLocally,
  generateReportKey,
  isOfflineReport,
  deleteReportLocally,
} from '@/api/report/submit-report'
import { formatTeamNumber } from '@/utils/format-team-number'
import TeamPicker from '../team-picker'
import FieldCard from '../field-card'
import TextInput from '../text-input'
import Button from '../button'
import { Report, Field, GetReport, OfflineReport } from '@/api/report'
import { useSchema } from '@/cache/schema/use'
import { SetRequired } from 'type-fest'
import { useEventInfo } from '@/cache/event-info/use'
import { deleteReport } from '@/api/report/delete-report'
import { useJWT } from '@/jwt'
import { Dropdown } from '../dropdown'
import { usePromise } from '@/utils/use-promise'
import { getUsers } from '@/api/user/get-users'
import { getRealms } from '@/api/realm/get-realms'
import Icon from '../icon'
import { mdiAccountCircle } from '@mdi/js'
import { useEventMatches } from '@/cache/event-matches/use'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'
import { matchHasTeam } from '@/utils/match-has-team'

// http://localhost:2733/reports/2911

const scoutStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const commentStyles = css`
  width: 25rem;
  max-width: 80%;
`

const buttonStyles = css`
  margin: 1rem;
`

interface Props {
  initialReport: SetRequired<Partial<Report>, 'eventKey' | 'matchKey'>
  onSaveSuccess: (report: GetReport) => void
  onSaveLocally?: (report: OfflineReport) => void
  onDelete: () => void
}

const isFieldReportable = (
  field: StatDescription,
): field is ReportStatDescription => field.reportReference !== undefined
const isAuto = (field: ReportStatDescription) => field.period === 'auto'
const isTeleop = (field: ReportStatDescription) => field.period === 'teleop'

// Number properties default to 0 and boolean properties default to 0 which represents false
const defaultFieldValue = 0

const userDropdownStyle = css`
  display: flex;
  margin: 1rem;
  align-items: center;
`

export const ReportEditor = ({
  initialReport,
  onSaveLocally,
  onSaveSuccess,
  onDelete,
}: Props) => {
  const eventKey = initialReport.eventKey
  const [team, setTeam] = useState<string | null>(initialReport.teamKey || null)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [matchKey, setMatchKey] = useState(initialReport.matchKey)
  const [comment, setComment] = useState(initialReport.comment || '')
  const schemaId = useEventInfo(eventKey)?.schemaId
  const schema = useSchema(schemaId)?.schema
  const eventMatches = useEventMatches(eventKey)
  const match = eventMatches?.find((match) => matchKey === match.key)
  const { jwt } = useJWT()
  const isAdmin = jwt?.peregrineRoles.isAdmin
  const users = usePromise(() => getUsers(), [])
  const [reporterId, setReporterId] = useState(initialReport.reporterId)
  const [realmId, setRealmId] = useState(initialReport.realmId)
  const [reportData, setReportData] = useState<Report['data']>(
    initialReport.data || [],
  )

  useEffect(() => {
    if (team && match && !matchHasTeam(team)(match)) setTeam(null)
  }, [team, match])

  useEffect(() => {
    if (!jwt) return
    setReporterId((reporterId) => reporterId ?? Number(jwt.sub))
    setRealmId((realmId) => realmId ?? jwt.peregrineRealm)
  }, [jwt])

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
  const realms = usePromise(() => getRealms(), [])
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
    if (!matchKey || !team || !jwt || !match || !reporterId || !realmId)
      return false

    return {
      id: initialReport.id,
      key: initialReport.key,
      eventKey,
      matchKey,
      comment,
      data: reportData,
      teamKey: team,
      reporterId: reporterId ?? Number(jwt.sub),
      realmId: realmId ?? jwt.peregrineRealm,
    }
  }
  const report = getReportIfValid()

  const submit = (e: Event) => {
    e.preventDefault()
    if (!report) return
    setIsSaving(true)
    uploadReport(report)
      .then((id) => {
        onSaveSuccess({ ...report, id })
      })
      .catch(() => {
        const reportWithKey = {
          ...report,
          key: initialReport.key || generateReportKey(),
        }
        saveReportLocally(reportWithKey)
        if (onSaveLocally) onSaveLocally(reportWithKey)
      })
      .finally(() => {
        setIsSaving(false)
      })
  }
  const handleDelete = async (e: Event) => {
    e.preventDefault()
    if (initialReport.key) {
      deleteReportLocally(initialReport.key)
    } else {
      const reportId = initialReport.id
      if (reportId !== undefined) {
        setIsDeleting(true)
        await deleteReport(reportId)
        setIsDeleting(false)
      }
    }
    onDelete()
  }

  return (
    <form class={scoutStyles} onSubmit={submit}>
      <h1>Scout {team && formatTeamNumber(team)}</h1>
      {eventMatches && (
        <Dropdown
          options={eventMatches}
          onChange={(match) => setMatchKey(match.key)}
          getKey={(match) => match.key}
          getText={(match) => formatMatchKeyShort(match.key)}
          value={eventMatches.find((match) => match.key === matchKey)}
        />
      )}
      {blueAlliance && redAlliance && (
        <TeamPicker
          onChange={setTeam}
          blueAlliance={blueAlliance}
          redAlliance={redAlliance}
          value={team}
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
      <TextInput
        class={commentStyles}
        label="Comments"
        onInput={setComment}
        value={comment}
      />
      {isAdmin && users && (
        <div class={userDropdownStyle}>
          <Icon icon={mdiAccountCircle} />
          <Dropdown
            options={users.sort((a, b) =>
              a.firstName.toLowerCase() > b.firstName.toLowerCase() ? 1 : -1,
            )}
            onChange={(user) => {
              setReporterId(user.id)
              setRealmId(user.realmId)
            }}
            getKey={(user) => user.id}
            getText={(user) => `${user.firstName} ${user.lastName}`}
            getGroup={(user) =>
              realms?.find((realm) => realm.id === user.realmId)?.name ||
              String(user.realmId)
            }
            value={users.find((user) => user.id === reporterId)}
          />
        </div>
      )}
      <Button disabled={isSaving || isDeleting || !report} class={buttonStyles}>
        {isSaving ? 'Saving Report' : 'Save Report'}
      </Button>
      <Button
        disabled={isSaving || isDeleting || !report}
        class={buttonStyles}
        onClick={handleDelete}
      >
        {isDeleting ? 'Deleting Report' : 'Delete Report'}
      </Button>
    </form>
  )
}

// http://localhost:2733/reports/3466
