import { css } from 'linaria'
import { StatDescription, ReportStatDescription } from '@/api/schema'
import { useState, useMemo, useEffect } from 'preact/hooks'
import {
  uploadReport,
  saveReportLocally,
  generateReportKey,
  deleteReportLocally,
} from '@/api/report/submit-report'
import TeamPicker from './team-picker'
import FieldCard from './field-card'
import TextInput from './text-input'
import Button from './button'
import { Report, Field, GetReport, OfflineReport } from '@/api/report'
import { useSchema } from '@/cache/schema/use'
import { SetRequired } from 'type-fest'
import { useEventInfo } from '@/cache/event-info/use'
import { deleteReport } from '@/api/report/delete-report'
import { useJWT } from '@/jwt'
import { Dropdown } from './dropdown'
import { usePromise } from '@/utils/use-promise'
import { getUsers } from '@/api/user/get-users'
import { getRealms } from '@/api/realm/get-realms'
import Icon from './icon'
import { mdiAccountCircle } from '@mdi/js'
import { useEventMatches } from '@/cache/event-matches/use'
import { formatMatchKeyShort } from '@/utils/format-match-key-short'
import { matchHasTeam } from '@/utils/match-has-team'
import { createDialog } from './dialog'
import Loader from './loader'
import Card from './card'
import { isData } from '@/utils/is-data'
import { getReports } from '@/api/report/get-reports'

const reportEditorStyle = css`
  padding: 1.5rem 2rem;
  display: grid;
  grid-gap: 1.2rem;
  justify-items: center;

  & > h2 {
    justify-self: center;
    margin: 0;
  }
`

const commentStyles = css`
  justify-self: stretch;
`

interface Props {
  initialReport: SetRequired<Partial<Report>, 'eventKey' | 'matchKey'>
  onMatchSelect?: (newMatchKey: string) => void
  onSaveSuccess: (report: GetReport) => void
  onSaveLocally?: (report: OfflineReport) => void
  onDelete?: () => void
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
  align-items: center;
`

// eslint-disable-next-line complexity
export const ReportEditor = ({
  initialReport,
  onMatchSelect,
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

  const eventInfo = useEventInfo(eventKey)
  const schemaId = isData(eventInfo) ? eventInfo.schemaId : undefined
  const testSchema = useSchema(schemaId)
  const schema = isData(testSchema) ? testSchema.schema : undefined

  const eventMatches = useEventMatches(eventKey)
  const match = isData(eventMatches)
    ? eventMatches.find((match) => matchKey === match.key)
    : undefined
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
      reporterId: Number(jwt.sub),
      realmId: jwt.peregrineRealm,
    }
  }
  const report = getReportIfValid()

  const submit = async (e: Event) => {
    e.preventDefault()
    if (!report) return
    setIsSaving(true)
    const matchReports = await getReports({
      event: report.eventKey,
      match: report.matchKey,
    })
    let shouldOverride = true
    for (const conflictReport of matchReports) {
      if (
        conflictReport.id !== report.id &&
        conflictReport.teamKey === report.teamKey &&
        conflictReport.reporterId === report.reporterId
      ) {
        const conflictingId = conflictReport.id
        shouldOverride = await createDialog({
          confirm: `Override Report ${conflictingId}`,
          dismiss: 'Cancel',
          description: `There is already a report with the same reporter, team, and match.`,
          title: `This report conflicts with report ${conflictingId}.`,
        })
      }
    }
    if (shouldOverride) {
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
  }
  const handleDelete = async (e: Event) => {
    const confirmDelete = await createDialog({
      confirm: 'Delete Report',
      dismiss: 'Cancel',
      description: '',
      title: 'Confirm Delete',
    })
    if (confirmDelete) {
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
      onDelete?.()
    }
  }
  const reportAlreadyExists =
    initialReport.key !== undefined || initialReport.id !== undefined

  return eventMatches && match && visibleFields ? (
    <Card as="form" class={reportEditorStyle} onSubmit={submit}>
      <Dropdown
        options={isData(eventMatches) ? eventMatches : []}
        onChange={(match) => {
          onMatchSelect?.(match.key)
          setMatchKey(match.key)
        }}
        getKey={(match) => match.key}
        getText={(match) => formatMatchKeyShort(match.key)}
        value={
          isData(eventMatches)
            ? eventMatches.find((match) => match.key === matchKey)
            : undefined
        }
      />
      <TeamPicker
        onChange={setTeam}
        blueAlliance={match.blueAlliance}
        redAlliance={match.redAlliance}
        value={team}
      />
      <h2>Auto</h2>
      {visibleFields.filter(isAuto).map((stat) => (
        <FieldCard
          key={'auto' + stat.reportReference}
          statDescription={stat}
          value={getReportFieldValue(stat)}
          onChange={updateReportField(stat.reportReference)}
        />
      ))}
      <h2>Teleop</h2>
      {visibleFields.filter(isTeleop).map((stat) => (
        <FieldCard
          key={'teleop' + stat.reportReference}
          statDescription={stat}
          value={getReportFieldValue(stat)}
          onChange={updateReportField(stat.reportReference)}
        />
      ))}
      <TextInput
        labelClass={commentStyles}
        label="Comments"
        onInput={setComment}
        value={comment}
      />
      {reportAlreadyExists && isAdmin && users && (
        <div class={userDropdownStyle}>
          <Icon icon={mdiAccountCircle} />
          <Dropdown
            options={
              isData(users)
                ? users.sort((a, b) =>
                    a.firstName.toLowerCase() > b.firstName.toLowerCase()
                      ? 1
                      : -1,
                  )
                : []
            }
            onChange={(user) => {
              setReporterId(user.id)
              setRealmId(user.realmId)
            }}
            getKey={(user) => user.id}
            getText={(user) => `${user.firstName} ${user.lastName}`}
            getGroup={(user) =>
              isData(realms)
                ? realms.find((realm) => realm.id === user.realmId)?.name ||
                  String(user.realmId)
                : null
            }
            value={
              isData(users)
                ? users.find((user) => user.id === reporterId)
                : undefined
            }
          />
        </div>
      )}
      <Button disabled={isSaving || isDeleting || !report}>
        {isSaving ? 'Saving Report' : 'Save Report'}
      </Button>
      {reportAlreadyExists && (
        <Button
          disabled={isSaving || isDeleting || !report}
          onClick={handleDelete}
        >
          {isDeleting ? 'Deleting Report' : 'Delete Report'}
        </Button>
      )}
    </Card>
  ) : (
    <Loader />
  )
}
