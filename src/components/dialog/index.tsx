import { useState, useRef } from 'preact/hooks'
import { h } from 'preact'
import { css } from 'linaria'
import { rgba } from 'polished'
import { createShadow } from '@/utils/create-shadow'
import { TextButton } from '@/components/text-button'
import { pxToRem } from '@/utils/px-to-rem'

interface DialogOpts {
  confirm: string
  dismiss: string
  title?: string
  description: string
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
  min-width: 15rem;

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

const dialogWrapperStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${rgba('#000000', 0.32)};
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const DialogDisplayer = () => {
  const [dialogs, setDialogs] = useState<Dialog[]>([])
  const dialogEl = useRef<HTMLDivElement | null>(null)
  createDialog = opts => {
    let resolvePromise: (value: boolean) => void
    const promise = new Promise<boolean>(resolve => {
      resolvePromise = resolve
    })
    setDialogs(dialogs => [...dialogs, { ...opts, resolvePromise }])
    return promise
  }

  if (dialogs.length === 0) return null

  const dialog = dialogs[0]

  const handleClick = (value: boolean) => () => {
    dialog.resolvePromise(value)
    setDialogs(dialogs => dialogs.slice(1))
  }

  const dismiss = handleClick(false)
  const confirm = handleClick(true)

  return (
    <div
      class={dialogWrapperStyle}
      onClick={e => {
        // make sure click is from _this_ element, not a descendant
        if (e.target === dialogEl.current) dismiss()
      }}
      role="none"
      ref={dialogEl}
    >
      <div class={dialogStyle} aria-modal="true" role="dialog">
        {dialog.title && <h1>{dialog.title}</h1>}
        <p>{dialog.description}</p>
        <div class={actionsStyle}>
          <TextButton onClick={dismiss}>{dialog.dismiss}</TextButton>
          <TextButton onClick={confirm}>{dialog.confirm}</TextButton>
        </div>
      </div>
    </div>
  )
}
