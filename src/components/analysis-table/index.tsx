import { h, Component, JSX } from 'preact'
import { Schema } from '@/api/schema'
import { NormalizedStat } from '@/api/stats'
import Card from '../card'
import style from './style.css'
import Icon from '../icon'
import { arrowLeft } from '@/icons/arrow-left'
import clsx from 'clsx'
import { compareTeams } from '@/utils/compare-teams'
import { formatPercent } from '@/utils/format-percent'
import { round } from '@/utils/round'
import { Dropdown } from '@/components/dropdown'

const TableHeader = ({
  children,
  selected,
  onClick,
  reversed,
}: {
  children: string
  key?: string
  onClick: () => void
  selected: boolean
  reversed: boolean
}) => (
  <th class={style.tableHeader}>
    <button onClick={onClick}>
      {children}
      {selected ? (
        <div class={clsx(style.icon, reversed && style.reversed)}>
          <Icon icon={arrowLeft} />
        </div>
      ) : (
        ''
      )}
    </button>
  </th>
)

const eachStat = (schema: Schema) => {
  return [
    ...schema.auto.map(i => ({
      name: i.name,
      key: 'auto' + i.name,
      gamePart: 'auto' as 'auto',
    })),
    ...schema.teleop.map(i => ({
      name: i.name,
      key: 'teleop' + i.name,
      gamePart: 'teleop' as 'teleop',
    })),
  ]
}

const getValueByStatType = (stat: NormalizedStat, statType: StatType) => {
  const s = stat.successes
  const a = stat.attempts
  if (statType === 'Attempts') return a
  if (statType === 'Successes') return s
  return {
    type: s.type,
    avg: s.avg / a.avg || 0, // handle dividing by zero, NaN is falsy,
    max: s.max / a.max || 0, // handle dividing by zero, NaN is falsy
  }
}

interface Props {
  teams: {
    team: string
    auto: { [key: string]: NormalizedStat }
    teleop: { [key: string]: NormalizedStat }
  }[]
  schema: Schema
  renderTeam: (team: string) => JSX.Element
  class?: string
}

type SortType = 'teamNum' | 'auto' | 'teleop'
type StatType = 'Successes' | 'Attempts' | '% Success'

interface State {
  sortStat: string | null
  sortType: SortType
  reversed: boolean
  statType: StatType
}

class AnalysisTable extends Component<Props, State> {
  state: State = {
    sortStat: null,
    sortType: 'teamNum',
    reversed: false,
    statType: 'Successes',
  }

  sortBy = (sortType: SortType, sortStat: string | null = null) => () => {
    this.setState((s: State) => ({
      sortType,
      sortStat,
      reversed:
        s.sortStat === sortStat && s.sortType === sortType
          ? !s.reversed
          : false,
    }))
  }

  render(
    { teams, schema, renderTeam, class: className }: Props,
    { sortStat, sortType, reversed, statType }: State,
  ) {
    const transformedStats = eachStat(schema)
    return (
      <Card class={clsx(className, style.analysisTable)}>
        <div class={style.wrapper}>
          <table>
            <thead>
              <tr class={style.groupHeader}>
                <th>
                  <Dropdown
                    options={
                      ['Successes', 'Attempts', '% Success'] as StatType[]
                    }
                    onChange={v => {
                      this.setState({ statType: v })
                    }}
                  />
                </th>
                <th class={style.auto} colSpan={schema.auto.length}>
                  <span>Auto</span>
                </th>
                <th class={style.teleop} colSpan={schema.teleop.length}>
                  <span>Teleop</span>
                </th>
              </tr>
              <tr class={style.statsHeader}>
                <TableHeader
                  onClick={this.sortBy('teamNum')}
                  selected={sortType === 'teamNum'}
                  reversed={reversed}
                >
                  Team
                </TableHeader>
                {transformedStats.map(({ name, key, gamePart }) => (
                  <TableHeader
                    key={key}
                    onClick={this.sortBy(gamePart, name)}
                    selected={sortStat === name && gamePart === sortType}
                    reversed={reversed}
                  >
                    {name}
                  </TableHeader>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams
                .sort((a, b) => {
                  const r = reversed ? -1 : 1
                  if (
                    (sortType === 'auto' || sortType === 'teleop') &&
                    sortStat
                  ) {
                    const gamePart = sortType
                    const aStat = a[gamePart][sortStat]
                    const bStat = b[gamePart][sortStat]
                    if (aStat || bStat) {
                      if (!aStat) return r
                      if (!bStat) return -r
                      const aVal = getValueByStatType(aStat, statType).avg
                      const bVal = getValueByStatType(bStat, statType).avg
                      const sortFactor = (bVal - aVal) * r
                      if (sortFactor !== 0) return sortFactor
                    }
                  }
                  return r * compareTeams(a.team, b.team)
                })
                .map(team => (
                  <tr key={team.team}>
                    <td>{renderTeam(team.team)}</td>
                    {transformedStats.map(({ name, key, gamePart }) => {
                      const stat = team[gamePart][name]
                      if (!stat) return <td key={key}>?</td>
                      const value = getValueByStatType(stat, statType)
                      const output =
                        value.type === 'percent' || statType === '% Success'
                          ? formatPercent(value.avg)
                          : `${round(value.avg)} (${round(value.max)})`
                      return <td key={key}>{output}</td>
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    )
  }
}

export default AnalysisTable
