import { useState } from 'preact/hooks'
import { css } from 'linaria'
import { createShadow } from '@/utils/create-shadow'
import { TextButton } from '@/components/text-button'
import { pxToRem } from '@/utils/px-to-rem'
import { Scrim, scrimHiddenClass } from '../scrim'

interface DialogOpts {
  confirm: string
  dismiss?: string
  title?: string
  description: string | JSX.Element
}

interface Dialog extends DialogOpts {
  resolvePromise: (value: boolean) => void
}

export let createDialog: (opts: DialogOpts) => Promise<boolean>

const dialogStyle = css`
  background: white;
  box-shadow: ${createShadow(24)};
  border-radius: 4px;
  overflow: hidden;
  min-width: 13rem;
  transition: inherit;
  transition-timing-function: cubic-bezier(0.15, 0.24, 0.13, 1.42);
  will-change: transform, opacity;

  .${scrimHiddenClass} & {
    transform: scale(0.7);
    opacity: 0;
  }

  & > * {
    margin: 0;
    padding-left: ${pxToRem(24)};
    padding-right: ${pxToRem(24)};
  }

  & > *:not(:last-child) {
    margin: 1rem 0;
  }

  h1,
  h2 {
    font-size: ${pxToRem(20)};
    font-weight: 500;
  }

  p {
    font-size: ${pxToRem(16)};
    color: rgba(0, 0, 0, 0.6);
  }
`

const actionsStyle = css`
  padding: ${pxToRem(8)};
  display: flex;
  justify-content: flex-end;

  & *:not(:first-child) {
    margin-left: ${pxToRem(8)};
  }
`

export const DialogDisplayer = () => {
  const [dialogs, setDialogs] = useState<Dialog[]>([])
  const [wasVisibleLastFrame, setWasVisibleLastFrame] = useState(false)
  createDialog = (opts) => {
    let resolvePromise: (value: boolean) => void
    const promise = new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })
    setDialogs((dialogs) => [...dialogs, { ...opts, resolvePromise }])
    return promise
  }

  if (dialogs.length === 0) {
    setWasVisibleLastFrame(false)
    return <Scrim visible={false} />
  }

  const dialog = dialogs[0]

  const handleClick = (value: boolean) => () => {
    dialog.resolvePromise(value)
    setDialogs((dialogs) => dialogs.slice(1))
  }

  const dismiss = handleClick(false)
  const confirm = handleClick(true)

  setTimeout(() => setWasVisibleLastFrame(true))

  return (
    <Scrim visible={wasVisibleLastFrame} onClickOutside={dismiss}>
      {/* eslint-disable-next-line caleb/jsx-a11y/no-noninteractive-tabindex */}
      <div tabIndex={0} class={dialogStyle} aria-modal="true" role="dialog">
        {dialog.title && <h1>{dialog.title}</h1>}
        {typeof dialog.description === 'string' ? (
          <p>{dialog.description}</p>
        ) : (
          dialog.description
        )}
        <div class={actionsStyle}>
          {dialog.dismiss && (
            <TextButton onClick={dismiss}>{dialog.dismiss}</TextButton>
          )}
          <TextButton onClick={confirm}>{dialog.confirm}</TextButton>
        </div>
      </div>
    </Scrim>
  )
}
