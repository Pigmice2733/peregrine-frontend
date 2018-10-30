import { h } from 'preact'
import Icon from '@/components/icon'
import style from './style.css'
import { Merge, falsy } from '@/type-utils'
import Card from '@/components/card'

interface Props {
  info: (
    | Merge<
        JSX.HTMLAttributes,
        {
          icon: string
          title: string | JSX.Element
          action?: falsy | JSX.Element | JSX.Element[]
        }
      >
    | falsy)[]
}

const isTruthy = <T extends object>(i: T | falsy): i is T => Boolean(i)

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
