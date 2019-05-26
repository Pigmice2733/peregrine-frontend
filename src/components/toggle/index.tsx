import { h } from 'preact'
import { css } from 'linaria'

const toggleStyle = css``

const Toggle = ({
  onChange,
  checked,
}: {
  onChange: (newValue: boolean) => void
  checked?: boolean
  key?: string | number
}) => (
  <div class={toggleStyle}>
    <input
      type="checkbox"
      onChange={e => onChange((e.target as HTMLInputElement).checked)}
      checked={checked}
    />
  </div>
)

export default Toggle
