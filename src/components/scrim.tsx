import { css } from 'linaria'
import { rgba } from 'polished'
import clsx from 'clsx'
import { useRef, useEffect } from 'preact/hooks'
import { moveFocusInside } from '@/utils/move-focus-inside'
import { getScrollbarWidth } from '@/utils/get-scrollbar-width'
import { PropsOf } from '@/type-utils'

// Scrim is a partially transparent dark full-screen backdrop used to focus the
// user's attention

const scrimStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.15s ease;

  &::before {
    z-index: -1; /* display behind other contents */
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    background: ${rgba('#000000', 0.32)};
    transition: inherit;
    opacity: 1;
    will-change: opacity;
  }
`

export const scrimHiddenClass = css`
  visibility: hidden;
  &.${scrimStyle}::before {
    opacity: 0;
  }
`

interface Props extends PropsOf<'div'> {
  onClickOutside?: () => void
  visible: boolean
}

const updateBodyOverflow = (visible: boolean) => {
  document.body.style.marginRight = visible ? getScrollbarWidth() : ''
  document.body.style.overflow = visible ? 'hidden' : ''
}

export const Scrim = ({
  onClickOutside = () => {},
  visible,
  ...props
}: Props) => {
  const scrimEl = useRef<HTMLDivElement | null>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!visible) return
    const keyupHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClickOutside()
    }
    window.addEventListener('keyup', keyupHandler)
    return () => window.removeEventListener('keyup', keyupHandler)
  }, [onClickOutside, visible])

  useEffect(() => {
    if (visible) {
      let hasFired = false
      const scrim = scrimEl.current as HTMLDivElement
      const firstChild = scrim.firstElementChild as HTMLElement | null
      const transitionEndHandler = (e: TransitionEvent) => {
        if ((e.target !== firstChild && e.target !== scrim) || hasFired) return
        hasFired = true
        previouslyFocusedElement.current = document.activeElement as HTMLElement | null
        if (firstChild) moveFocusInside(firstChild)
      }

      scrim.addEventListener('transitionend', transitionEndHandler)
      return () =>
        scrim.removeEventListener('transitionend', transitionEndHandler)
    }
    if (previouslyFocusedElement.current) {
      // reset focus back to where it was
      previouslyFocusedElement.current.focus()
    }
  }, [visible])

  useEffect(() => {
    updateBodyOverflow(visible)
    return () => {
      updateBodyOverflow(visible)
    }
  }, [visible])

  return (
    <div
      {...props}
      role="none"
      class={clsx(props.class, scrimStyle, visible || scrimHiddenClass)}
      onClick={(e) => {
        if (props.onClick) props.onClick.call(e.currentTarget, e)
        // make sure click is from _this_ element, not a descendant
        if (e.target === scrimEl.current) onClickOutside()
      }}
      ref={scrimEl}
    />
  )
}
