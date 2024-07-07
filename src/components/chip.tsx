import { css } from '@linaria/core'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

const chipStyle = css`
  background: #548050;
  border-radius: 9in;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  padding: 0.2em 0.5em;
  font-size: 0.9em;
  margin: 0 0.2em;
  display: inline-block;
  white-space: nowrap;

  .dark & {
    color: black;
    background: #4a964a;
  }
`

const dateChipStyle = css`
  background: #00000024;
  color: black;

  .dark & {
    color: var(--light-grey);
    background: #e8e8e824;
  }
`

const Chip = ({ children }: { children: string }) => (
  <span class={chipStyle}>{children}</span>
)

export const DateChip = ({ date }: { date: Date }) => (
  <span class={`${dateChipStyle} ${chipStyle}`}>
    {dateFormatter.format(date)}
  </span>
)

export default Chip
