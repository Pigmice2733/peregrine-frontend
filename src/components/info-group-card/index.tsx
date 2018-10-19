import { h } from 'preact'
import Icon from '../../components/icon'
import style from './style.css'

type falsy = null | undefined | false | '' | 0

type Merge<A, B> = { [K in keyof A]: K extends keyof B ? B[K] : A[K] } & B

interface Props {
  info: (
    | Merge<
        JSX.HTMLAttributes,
        {
          icon: string
          title: string | JSX.Element
          action?: falsy | JSX.Element
        }
      >
    | falsy)[]
}

const isTruthy = <T extends object>(i: T | falsy): i is T => Boolean(i)

const InfoGroupCard = ({ info }: Props) => (
  <div class={style.card}>
    {info.filter(isTruthy).map(({ icon, action, title, ...i }) => {
      const El = i.href ? 'a' : 'div'
      return (
        <El class={style.row} key={title} {...i}>
          <Icon icon={icon} />
          <div class={style.title}>{title}</div>
          {action && <div>{action}</div>}
        </El>
      )
    })}
  </div>
)

export default InfoGroupCard
