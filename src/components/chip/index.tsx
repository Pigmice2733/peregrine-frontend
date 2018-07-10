import { h, FunctionalComponent, ComponentChildren } from 'preact'
import style from './style.css'

interface ChipProps {
  fg?: string
  bg?: string
}

export const Chip: FunctionalComponent<ChipProps> = ({
  children,
  bg = 'cornflowerblue',
  fg = 'white',
}) => (
  <div class={style.chip} style={{ backgroundColor: bg, color: fg }}>
    {children}
  </div>
)
