import { h, JSX } from 'preact'
import { Merge } from '@/type-utils'
import Icon from '@/components/icon'
import style from './style.css'

type Props = Merge<JSX.HTMLAttributes, { icon: string }>

const IconButton = ({ icon, ...attrs }: Props) => {
  const El = attrs.href ? 'a' : 'button'
  return (
    <El class={style.iconButton} {...attrs}>
      <Icon icon={icon} />
    </El>
  )
}

export default IconButton
