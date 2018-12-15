import { h } from 'preact'
import style from './style.css'
import { formatTeamNumber } from '@/utils/format-team-number'

interface Props {
  redAlliance: string[]
  blueAlliance: string[]
  onChange: (newTeam: string) => void
}

const Item = ({
  team,
  onChange,
}: {
  team: string
  key?: string
  onChange: (team: string) => void
}) => (
  <label>
    <input type="radio" name="teamNum" onChange={() => onChange(team)} />
    <div class={style.team}>{formatTeamNumber(team)}</div>
  </label>
)

const TeamPicker = ({ redAlliance, blueAlliance, onChange }: Props) => (
  <div class={style.teamPicker}>
    <div class={style.alliance + ' ' + style.red}>
      {redAlliance.map(t => (
        <Item key={t} team={t} onChange={onChange} />
      ))}
    </div>
    <div class={style.alliance + ' ' + style.blue}>
      {blueAlliance.map(t => (
        <Item key={t} team={t} onChange={onChange} />
      ))}
    </div>
  </div>
)

export default TeamPicker
