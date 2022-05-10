import { formatTeamNumber } from '@/utils/format-team-number'
import { css } from 'linaria'
import clsx from 'clsx'

interface Props {
  redAlliance: string[]
  blueAlliance: string[]
  onChange?: (newTeam: string) => void
  value?: string | null
  editable?: boolean
}

const teamStyle = css`
  padding: 0.5rem;
  text-align: center;
`

const editableTeamStyle = css`
  cursor: pointer;
`

const labelStyle = css`
  color: white;
  font-weight: bold;
  flex-grow: 1;
`

const checkedTeamStyle = css`
  background: #ffffff38;
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
  checked,
  editable,
}: {
  team: string
  onChange?: (team: string) => void
  checked: boolean
  editable: boolean
}) => (
  <label class={labelStyle}>
    {editable && (
      <input
        class={inputStyle}
        type="radio"
        name="teamNum"
        onChange={() => onChange?.(team)}
        checked={checked}
      />
    )}
    <div
      class={clsx(
        teamStyle,
        checked && checkedTeamStyle,
        editable && editableTeamStyle,
      )}
    >
      {formatTeamNumber(team)}
    </div>
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
`

const editableTeamPickerStyle = css`
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

const TeamPicker = ({
  redAlliance,
  blueAlliance,
  onChange,
  value,
  editable = true,
}: Props) => (
  <div class={clsx(teamPickerStyle, editable && editableTeamPickerStyle)}>
    <div class={allianceStyle + ' ' + redStyle}>
      {redAlliance.map((t) => (
        <Item
          key={t}
          team={t}
          onChange={onChange}
          checked={t === value}
          editable={editable}
        />
      ))}
    </div>
    <div class={allianceStyle + ' ' + blueStyle}>
      {blueAlliance.map((t) => (
        <Item
          key={t}
          team={t}
          onChange={onChange}
          checked={t === value}
          editable={editable}
        />
      ))}
    </div>
  </div>
)

export default TeamPicker
