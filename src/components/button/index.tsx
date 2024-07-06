import { VNode } from 'preact'
import clsx from 'clsx'
import { css } from '@linaria/core'
import { tint } from 'polished'
import { pigmicePurple } from '@/colors'
import { PropsOf } from '@/type-utils'

export const buttonFontStyle = css`
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
`

const buttonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--pigmice-purple);
  border: none;
  padding: 0.6rem 0.7rem;
  border-radius: 0.2rem;
  color: white;
  cursor: pointer;
  box-shadow: 0.1rem 0.1rem 0.6rem #00000059;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  .dark & {
    background: #c000c0;
    color: black;
  }

  &:hover,
  &:focus {
    background: color-mod(var(--pigmice-purple) lightness(+5%));

    .dark & {
      background: #d020d0;
    }
  }

  &:hover {
    box-shadow: 0.1rem 0.1rem 1rem #00000059;
  }

  &:focus {
    box-shadow: 0 0 2px 4px var(--focus-ring);
    outline: none;
  }

  &[disabled] {
    background: #0000000d;
    color: #00000036;
    box-shadow: none;
    cursor: not-allowed;

    .dark & {
      background: #e8e8e836;
      color: #e8e8e870;
    }
  }
`

const flatButtonStyle = css`
  background: none !important;
  box-shadow: none;
  color: ${pigmicePurple};

  .dark & {
    color: #c000c0;
  }

  &:hover,
  &:focus {
    background: ${tint(0.8, pigmicePurple)};
    box-shadow: none;

    .dark & {
      background: #400040;
    }
  }
`

interface BaseProps {
  flat?: boolean
}

interface Button {
  (props: BaseProps & PropsOf<'a'> & { href: string }): VNode
  (props: BaseProps & PropsOf<'div'>): VNode
}

const Button: Button = (props: BaseProps & PropsOf<'a' | 'div'>) => {
  const El = props.href ? 'a' : 'button'
  return (
    <El
      {...(props as any)}
      class={clsx(
        buttonStyle,
        props.class,
        buttonFontStyle,
        props.flat && flatButtonStyle,
      )}
    />
  )
}

export default Button
