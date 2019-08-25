import { h, JSX } from 'preact'
import clsx from 'clsx'
import { css } from 'linaria'

const buttonStyle = css`
  text-align: center;
  background: var(--pigmice-purple);
  border: none;
  padding: 0.6rem 0.7rem;
  border-radius: 0.2rem;
  color: white;
  cursor: pointer;
  box-shadow: 0.1rem 0.1rem 0.6rem #00000059;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover,
  &:focus {
    background: color-mod(var(--pigmice-purple) lightness(+5%));
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
  }
`

const Button = (props: JSX.HTMLAttributes) => {
  const El = props.href ? 'a' : 'button'
  return <El {...props} class={clsx(buttonStyle, props.class)} />
}

export default Button
