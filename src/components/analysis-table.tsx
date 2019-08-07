import { h, JSX, FunctionComponent, Fragment } from 'preact'
import { Schema, StatDescription } from '@/api/schema'
import { TeamStats, Stat } from '@/api/stats'
import Card from '@/components/card'
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
import { round } from '@/utils/round'
import { useState } from 'preact/hooks'
import { Dropdown } from './dropdown'
import { css } from 'linaria'
import { createDialog } from './dialog'
import { blue, red, gray, lightGrey } from '@/colors'
import Icon from './icon'
import { settings as settingsIcon } from '@/icons/settings'

interface Props {
  teams: TeamStats[]
  schema: Schema
  renderTeam: (team: string) => JSX.Element
  class?: string
}

type StatType = 'Successes' | 'Attempts' | '% Success'
type AvgType = 'Avg' | 'Max'

const tableStyle = css`
  overflow: auto;
`

const cellStyle = css`
  text-align: center;
`

type RowType = TeamStats

const createStatCell = (
  avgType: AvgType,
  statType: StatType,
  gamePart: 'auto' | 'teleop',
) => (statDescription: StatDescription): Column<Stat | undefined, RowType> => {
  const avgTypeStr = avgType === 'Avg' ? 'avg' : 'max'
  return {
    title: statDescription.name,
    getCell: row => row[gamePart][statDescription.name] as Stat | undefined,
    renderCell: cell => {
      const text = cell
        ? statType === '% Success'
          ? formatPercent(
              cell.successes[avgTypeStr] / cell.attempts[avgTypeStr] || 0,
            )
          : statType === 'Attempts'
          ? cell.type === 'boolean'
            ? formatPercent(cell.attempts[avgTypeStr])
            : round(cell.attempts[avgTypeStr])
          : cell.type === 'boolean'
          ? formatPercent(cell.successes[avgTypeStr])
          : round(cell.successes[avgTypeStr])
        : '?'
      return <td class={cellStyle}>{`${text}`}</td>
    },
    getCellValue: cell =>
      cell
        ? statType === '% Success'
          ? cell.successes[avgTypeStr] / cell.attempts[avgTypeStr] || 0
          : statType === 'Attempts'
          ? cell.attempts[avgTypeStr]
          : cell.successes[avgTypeStr]
        : 0,
  }
}

const firstColumnWidth = '4rem'

const topLeftCellStyle = css`
  left: 0;
  z-index: 1;
  ${borderRightOnly};
  background: white;
  font-size: 15px;
  min-width: ${firstColumnWidth};
  padding: 0;
  display: flex;
  height: ${contextRowHeight};
`

const iconStyle = css`
  fill: ${gray};
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
  flex-grow: 1;
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

const autoStyle = css`
  box-shadow: inset 0 -3px ${blue};
  color: ${blue};
`

const teleopStyle = css`
  box-shadow: inset 0 -3px ${red};
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

const AnalysisTable: FunctionComponent<Props> = ({
  teams,
  schema,
  class: className,
}) => {
  const [statType, setStatType] = useState<StatType>('Successes')
  const [avgType, setAvgType] = useState<AvgType>('Avg')
  const teamColumn: Column<string, RowType> = {
    title: 'Team',
    getCell: row => row.team,
    getCellValue: team => parseInt(team),
    renderCell: cell => <th scope="row">{`${cell}`}</th>,
    sortOrder: SortOrder.ASC,
  }
  const columns = [
    teamColumn,
    ...schema.auto.map(createStatCell(avgType, statType, 'auto')),
    ...schema.teleop.map(createStatCell(avgType, statType, 'teleop')),
  ]
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
            onChange={v => setAvgType(v)}
            value={avgType}
          />
          <Dropdown
            class={dropdownStyle}
            options={['Successes', 'Attempts', '% Success'] as const}
            onChange={v => setStatType(v)}
            value={statType}
          />
        </div>
      ),
      confirm: 'Dismiss',
    })
  }
  return (
    <Card class={clsx(className, tableStyle)}>
      <Table
        columns={columns}
        rows={rows}
        contextRow={
          <Fragment>
            <th class={topLeftCellStyle}>
              <button class={iconButtonStyle} onClick={showSettings}>
                <Icon icon={settingsIcon} class={iconStyle} />
              </button>
            </th>
            <th
              class={clsx(contextSectionStyle, autoStyle)}
              colSpan={schema.auto.length}
            >
              <span>Auto</span>
            </th>
            <th
              class={clsx(contextSectionStyle, teleopStyle)}
              colSpan={schema.teleop.length}
            >
              <span>Teleop</span>
            </th>
          </Fragment>
        }
      />
    </Card>
  )
}

export default AnalysisTable
