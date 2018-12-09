import { h } from 'preact'
import style from './style.css'

interface Props {
  children: string
}

const Alert = (props: Props) => <div class={style.alert}>{props.children}</div>

export default Alert
