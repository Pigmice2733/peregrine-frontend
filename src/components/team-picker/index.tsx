import { h } from 'preact'
import { formatTeamNumber } from '@/utils/format-team-number'
import { css } from 'linaria'

interface Props {
  redAlliance: string[]
  blueAlliance: string[]
  onChange: (newTeam: string) => void
}

const teamStyle = css`
  padding: 0.5rem;
  cursor: pointer;
  text-align: center;
`

const labelStyle = css`
  color: white;
  font-weight: bold;
  flex-grow: 1;
`

const inputStyle = css`
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);

  &:checked + .${teamStyle}, &:hover + .${teamStyle} {
    background: #ffffff38;
  }
`

const Item = ({
  team,
  onChange,
}: {
  team: string
  key?: string
  onChange: (team: string) => void
}) => (
  <label class={labelStyle}>
    <input
      class={inputStyle}
      type="radio"
      name="teamNum"
      onChange={() => onChange(team)}
    />
    <div class={teamStyle}>{formatTeamNumber(team)}</div>
  </label>
)

const teamPickerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;
  width: 12rem;
  border-radius: 0.3rem;
  overflow: hidden;
  box-shadow: var(--card-shadow);

  &:focus-within,
  &:active {
    box-shadow: 0 0 0px 4px var(--focus-ring);
  }
`

const allianceStyle = css`
  display: flex;
  justify-content: stretch;
`

const redStyle = css`
  background-color: var(--alliance-red);
`

const blueStyle = css`
  background-color: var(--alliance-blue);
`

const TeamPicker = ({ redAlliance, blueAlliance, onChange }: Props) => (
  <div class={teamPickerStyle}>
    <div class={allianceStyle + ' ' + redStyle}>
      {redAlliance.map((t) => (
        <Item key={t} team={t} onChange={onChange} />
      ))}
    </div>
    <div class={allianceStyle + ' ' + blueStyle}>
      {blueAlliance.map((t) => (
        <Item key={t} team={t} onChange={onChange} />
      ))}
    </div>
  </div>
)

export default TeamPicker
