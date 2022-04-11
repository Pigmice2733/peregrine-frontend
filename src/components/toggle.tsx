import { css } from 'linaria'
import { lightGrey, pigmicePurple, grey } from '@/colors'
import { tint, shade, transparentize } from 'polished'
import { createShadow } from '@/utils/create-shadow'

const trackCenterCenter = 1
const trackHeight = 0.9
const trackRadius = trackHeight / 2
const circleDiameter = 1.2
const focusCircleDiameter = 2.3
/** Amount to offset the toggle from the center */
const centerOffset = trackCenterCenter / 2

const toggleStyle = css`
  appearance: none;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  width: ${trackCenterCenter + trackRadius * 2}rem;
  height: ${trackHeight}rem;
  margin: ${(focusCircleDiameter - trackHeight) / 2}rem;
  background: ${shade(0.04, lightGrey)};
  border-radius: ${trackRadius}rem;
  transition: all 0.15s ease-in-out;
  outline: none;

  &:checked {
    background: ${tint(0.5, pigmicePurple)};

    /* Main circle */
    &::after {
      background: ${pigmicePurple};
      transform: translateX(${centerOffset}rem);
    }

    /* Focus circle */
    &::before {
      transform: translateX(${centerOffset}rem);
      background: ${transparentize(0.2, pigmicePurple)};
    }
  }

  /* Main circle */
  &::after {
    width: ${circleDiameter}rem;
    height: ${circleDiameter}rem;
    background: ${shade(0.4, lightGrey)};
    box-shadow: ${createShadow(1)};
  }

  /* Focus circle */
  &::before {
    width: ${focusCircleDiameter}rem;
    height: ${focusCircleDiameter}rem;
    background: ${grey};
    opacity: 0;
  }

  &:hover::before {
    opacity: 0.15;
  }

  &:focus::before {
    opacity: 0.25;
  }

  &::before,
  &::after {
    position: absolute;
    content: '';
    transform: translateX(${-centerOffset}rem);
    border-radius: 50%;
    transition: inherit;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &::before {
      opacity: 0;
    }
  }
`

interface Props {
  onChange: (newValue: boolean) => void
  checked?: boolean
  disabled?: boolean
}

const Toggle = ({ onChange, checked, disabled }: Props) => (
  <input
    type="checkbox"
    disabled={disabled}
    class={toggleStyle}
    checked={checked}
    onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
  />
)

export default Toggle
