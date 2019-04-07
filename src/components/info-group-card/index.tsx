import { h, JSX } from 'preact'
import Icon from '@/components/icon'
import { Falsy } from '@/type-utils'
import Card, { CardProps } from '@/components/card'

import style from './style.css'

interface Props {
  info: (
    | CardProps<{
        icon: string
        title: string | JSX.Element
        action?: Falsy | JSX.Element | JSX.Element[] | string | number
      }>
    | Falsy)[]
}

const isTruthy = <T extends object>(i: T | Falsy): i is T => Boolean(i)

const InfoGroupCard = ({ info }: Props) => (
  <Card class={style.infoCard}>
    {info.filter(isTruthy).map(({ icon, action, title, ...i }) => {
      const El = i.href ? 'a' : 'div'
      return (
        <El class={style.row} key={icon} {...i}>
          <Icon icon={icon} />
          <div class={style.title}>{title}</div>
          {action && <div>{action}</div>}
        </El>
      )
    })}
  </Card>
)

export default InfoGroupCard
