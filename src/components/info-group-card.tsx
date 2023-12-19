import Icon from '@/components/icon'
import { Falsy, Merge, PropsOf } from '@/type-utils'
import Card from '@/components/card'
import { css } from 'linaria'
import clsx from 'clsx'

const infoCardStyle = css`
  overflow: hidden;
  flex-direction: column;
`

const rowStyle = css`
  display: flex;
  font-size: 0.9rem;
  align-items: center;
  border-bottom: 0.1em solid #eee;
  color: inherit;
  text-decoration: none;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  max-height: 3rem;
  overflow: hidden;

  &[href]:hover,
  &:focus {
    background: #f1f1f1;
    outline: none;
  }

  &:last-child {
    border: none;
  }

  & svg {
    margin: 0.8em;
    flex-shrink: 0;
  }

  & path {
    fill: currentColor;
  }

  & > :last-child:not(:nth-child(2)) {
    margin-left: auto;
    min-width: 6rem;
    display: flex;
    justify-content: center;
  }
`

const titleStyle = css`
  overflow: hidden;
  text-overflow: ellipsis;
`

interface Props {
  info: (
    | Merge<
        PropsOf<'a'>,
        {
          icon: string
          title: string | JSX.Element
          action?: Falsy | JSX.Element | JSX.Element[] | string | number
        }
      >
    | Falsy
  )[]
}

const isTruthy = <T extends object>(i: T | Falsy): i is T => Boolean(i)

const InfoGroupCard = ({ info, ...props }: Merge<Props, PropsOf<'div'>>) => (
  <Card {...props} class={clsx(infoCardStyle, props.class)}>
    {info.filter(isTruthy).map(({ icon, action, title, ...i }) => {
      const El = i.href ? 'a' : 'div'
      return (
        <El class={rowStyle} key={icon} {...(i as any)}>
          <Icon icon={icon} />
          <div class={titleStyle}>{title}</div>
          {action && <div>{action}</div>}
        </El>
      )
    })}
  </Card>
)

export default InfoGroupCard
