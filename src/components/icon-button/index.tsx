import { h, JSX } from 'preact'
import { Merge } from '@/type-utils'
import Icon from '@/components/icon'
import { css } from 'linaria'
import clsx from 'clsx'

const iconButtonStyle = css`
  cursor: pointer;
  transition: all 0.1s ease;
  border-radius: 50%;
  --side: 2.5rem;
  width: var(--side);
  height: var(--side);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0.4rem 0;
  color: inherit;
  background: transparent;
  border: none;
  padding: 0;

  &:hover,
  &:focus {
    background: color-mod(#aaa alpha(25%));
    outline: none;
  }
`

type Props = Merge<JSX.HTMLAttributes, { icon: string }>

const IconButton = ({ icon, ...attrs }: Props) => {
  const El = attrs.href ? 'a' : 'button'
  return (
    <El {...attrs} class={clsx(iconButtonStyle, attrs.class)}>
      <Icon icon={icon} />
    </El>
  )
}

export default IconButton
