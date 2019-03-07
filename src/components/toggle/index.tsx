import { h } from 'preact'
import style from './style.css'

const Toggle = ({
  onChange,
  checked,
}: {
  onChange: (newValue: boolean) => void
  checked?: boolean
  key?: string | number
}) => (
  <div class={style.toggle}>
    <input
      type="checkbox"
      onChange={e => onChange((e.target as HTMLInputElement).checked)}
      checked={checked}
    />
  </div>
)

export default Toggle
