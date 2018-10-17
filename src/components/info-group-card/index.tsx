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
          href?: string
          title: string | JSX.Element
          action?: falsy | JSX.Element
        }
      >
    | falsy)[]
}

const isTruthy = <T extends object>(i: T | falsy): i is T => Boolean(i)

const InfoGroupCard = ({ info }: Props) => (
  <div class={style.card}>
    {info.filter(isTruthy).map(i => {
      const El = i.href ? 'a' : 'div'
      return (
        <El class={style.row} key={i.title} href={i.href}>
          <Icon icon={i.icon} />
          <div class={style.title}>{i.title}</div>
          {i.action && <div>{i.action}</div>}
        </El>
      )
    })}
  </div>
)

export default InfoGroupCard
