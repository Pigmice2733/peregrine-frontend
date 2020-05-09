import { h, JSX, Fragment } from 'preact'
import { Schema, StatDescription, StatType } from '@/api/schema'
import { Stat, ProcessedTeamStats } from '@/api/stats'
import clsx from 'clsx'
import {
  Table,
  Column,
  Row,
  SortOrder,
  borderRightOnly,
  contextRowHeight,
} from '@/components/table'
import { formatPercent } from '@/utils/format-percent'
import { useState } from 'preact/hooks'
import { Dropdown } from './dropdown'
import { css } from 'linaria'
import { createDialog } from './dialog'
import { blue, red, grey, lightGrey, textGrey } from '@/colors'
import Icon from './icon'
import { settings as settingsIcon } from '@/icons/settings'
import { round } from '@/utils/round'
import Spinner from './spinner'
import { cleanFieldName } from '@/utils/clean-field-name'
import { getFieldKey } from '@/utils/get-field-key'
import { usePromise } from '@/utils/use-promise'
import { getEventTeams } from '@/api/event-team-info/get-event-teams'
import { eventTeamUrl } from '@/utils/urls/event-team'
import { EventTeamInfo } from '@/api/event-team-info'

interface Props {
  eventKey: string
  teams: ProcessedTeamStats[] | undefined
  schema: Schema
  renderTeam: (team: string, link: string) => JSX.Element
  renderBoolean?: (cell: StatWithType, avgTypeStr: 'avg' | 'max') => JSX.Element
  enableSettings?: boolean
}

type AvgType = 'Avg' | 'Max'

const cellStyle = css`
  text-align: center;
`

type RowType = ProcessedTeamStats

type StatWithType = Stat & { type: StatType }

const createStatCell = (
  avgType: AvgType,
  renderBoolean?: (
    cell: StatWithType,
    avgTypeStr: 'avg' | 'max',
  ) => JSX.Element,
) => (
  statDescription: StatDescription,
): Column<StatWithType | undefined, RowType> => {
  const avgTypeStr = avgType === 'Avg' ? 'avg' : 'max'
  return {
    title: cleanFieldName(statDescription.name),
    getCell: (row) => {
      const matchingCell = row.summary[statDescription.name]
      if (matchingCell)
        return {
          ...matchingCell,
          type: statDescription.type,
        }
    },
    key: getFieldKey(statDescription),
    renderCell: (cell) => {
      const text = cell
        ? cell.type === 'boolean'
          ? renderBoolean?.(cell, avgTypeStr) || formatPercent(cell[avgTypeStr])
          : round(cell[avgTypeStr])
        : '?'
      return <td class={cellStyle}>{text}</td>
    },
    sortOrder: SortOrder.DESC,
    getCellValue: (cell) => (cell ? cell[avgTypeStr] : -1),
  }
}

const firstColumnWidth = '4rem'

const topLeftCellStyle = css`
  left: 0;
  z-index: 1;
  ${borderRightOnly};
  background: white;
  min-width: ${firstColumnWidth};
  padding: 0;
  height: ${contextRowHeight};
`

const iconStyle = css`
  fill: ${grey};
  width: calc(${contextRowHeight} - 0.2rem);
  height: calc(${contextRowHeight} - 0.2rem);
  border-radius: 50%;
  padding: 0.1rem;
`

const iconButtonStyle = css`
  background: transparent;
  padding: 0;
  margin: 0;
  border: 0;
  display: flex;
  width: 100%;
  justify-content: center;
  outline: none;
  cursor: pointer;

  &:hover .${iconStyle}, &:focus .${iconStyle} {
    background: ${lightGrey};
  }
`

const contextSectionStyle = css`
  font-size: 0.85rem;
  background: white;
  text-align: left;
  padding: 0;

  & span {
    position: sticky;
    left: ${firstColumnWidth};
    padding: 0.4rem;
    font-size: 0.78rem;
  }
`

const rankStyle = css`
  box-shadow: inset 0 -0.15rem #398013;
  color: #398013;
`

const autoStyle = css`
  box-shadow: inset 0 -0.15rem ${blue};
  color: ${blue};
`

const teleopStyle = css`
  box-shadow: inset 0 -0.15rem ${red};
  color: ${red};
`

const settingsStyle = css`
  display: grid;
  grid-gap: 0.5rem;
  padding: 0 1.5rem;
`

const dropdownStyle = css`
  padding: 0.2rem;
`

const teamNumCellStyle = css`
  padding: 0;

  & a {
    display: block;
    padding: 0.8rem 0.6rem;
    text-decoration: none;
  }
`

const teamRankStyle = css`
  position: absolute;
  font-size: 0.75rem;
  right: 0.15rem;
  top: 0.15rem;
  color: ${grey};
`

const AnalysisTable = ({
  eventKey,
  teams,
  schema,
  renderTeam,
  renderBoolean,
  enableSettings = true,
}: Props) => {
  const rankingInfo = usePromise(() => getEventTeams(eventKey), [eventKey])
  const [avgType, setAvgType] = useState<AvgType>('Avg')
  const teamColumn: Column<string, RowType> = {
    title: 'Team',
    key: 'Team',
    getCell: (row) => row.team,
    getCellValue: (team) => Number.parseInt(team),
    renderCell: (team, _row, rowIndex, sortColKey) => {
      const isSortingByStat =
        sortColKey.startsWith('auto') || sortColKey.startsWith('teleop')
      return (
        <th scope="row" class={teamNumCellStyle}>
          {isSortingByStat && (
            <div className={teamRankStyle}>{rowIndex + 1}</div>
          )}
          {renderTeam(
            team,
            eventTeamUrl(
              eventKey,
              team,
              isSortingByStat ? sortColKey : undefined,
            ),
          )}
        </th>
      )
    },
    sortOrder: SortOrder.ASC,
  }

  const rankCellStyle = css`
    white-space: nowrap;
    text-align: center;
    min-width: 5.5rem;

    & :not(:first-child) {
      padding-left: 0.25rem;
      font-size: 0.7rem;
      color: ${textGrey};
    }
  `

  const rankColumn: Column<EventTeamInfo | undefined, RowType> = {
    title: 'Rank',
    key: 'Rank',
    getCell: (row) => rankingInfo?.find((r) => r.team === 'frc' + row.team),
    getCellValue: (cell) => cell?.rank ?? Infinity,
    renderCell: (cell) => (
      <td class={rankCellStyle}>
        <span>{cell?.rank === undefined ? '?' : cell.rank}</span>
        {cell?.rankingScore !== undefined && (
          <span>{`(${round(cell.rankingScore)} RP)`}</span>
        )}
      </td>
    ),
    sortOrder: SortOrder.ASC,
  }
  const allDisplayableFields = schema.schema.filter((f) => !f.hide)
  const autoFields = allDisplayableFields.filter((f) => f.period === 'auto')
  const teleopFields = allDisplayableFields.filter((f) => f.period === 'teleop')
  const columns = [
    teamColumn,
    rankColumn,
    ...autoFields.map(createStatCell(avgType, renderBoolean)),
    ...teleopFields.map(createStatCell(avgType, renderBoolean)),
  ]
  if (!teams) return <Spinner />
  const rows = teams.map(
    (team): Row<RowType> => ({ key: team.team, value: team }),
  )
  const showSettings = () => {
    createDialog({
      title: 'Analysis Settings',
      description: (
        <div class={settingsStyle}>
          <Dropdown
            class={dropdownStyle}
            options={['Avg', 'Max'] as const}
            onChange={(v) => setAvgType(v)}
            value={avgType}
          />
        </div>
      ),
      confirm: 'Dismiss',
    })
  }
  return (
    <Table
      columns={columns}
      rows={rows}
      contextRow={
        <Fragment>
          <th class={topLeftCellStyle}>
            {enableSettings && (
              <button class={iconButtonStyle} onClick={showSettings}>
                <Icon icon={settingsIcon} class={iconStyle} />
              </button>
            )}
          </th>
          <th class={clsx(contextSectionStyle, rankStyle)} colSpan={1}>
            <span>Rank</span>
          </th>
          <th
            class={clsx(contextSectionStyle, autoStyle)}
            colSpan={autoFields.length}
          >
            <span>Auto</span>
          </th>
          <th
            class={clsx(contextSectionStyle, teleopStyle)}
            colSpan={teleopFields.length}
          >
            <span>Teleop</span>
          </th>
        </Fragment>
      }
    />
  )
}

export default AnalysisTable
