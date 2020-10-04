import { RenderableProps, ComponentChildren } from 'preact'
import { ErrorBoundary } from '../error-boundary'
import { css } from 'linaria'
import { createShadow } from '@/utils/create-shadow'
import { pigmicePurple } from '@/colors'
import IconButton, { iconButtonClass } from '../icon-button'
import { arrowLeft } from '@/icons/arrow-left'
import { menu } from '@/icons/menu'
import clsx from 'clsx'
import { useState } from 'preact/hooks'
import { Menu } from '@/components/menu'
import { Merge } from 'type-fest'

const spacing = '0.15rem'

const headerStyle = css`
  box-shadow: ${createShadow(4)};
  position: sticky;
  top: 0;
  background: ${pigmicePurple};
  color: white;
  padding: ${spacing};
  display: flex;
  justify-content: flex-start;
  flex-shrink: 0;
  z-index: 4;
  align-items: center;

  & > * {
    font-size: 1rem;
    font-weight: 700;
    margin: ${spacing};
  }

  & > .${iconButtonClass} {
    flex-shrink: 0;
  }

  & > .${iconButtonClass}:last-child {
    margin-left: auto;
  }
`

const headerText = css`
  padding: 0 0.6rem;
  white-space: nowrap;
  flex-shrink: 1;
  text-overflow: ellipsis;
  overflow: hidden;
`

type Props = Merge<
  JSX.HTMLAttributes,
  {
    name: ComponentChildren
    back: string | (() => void) | false
    class?: string
    wrapperClass?: string
  }
>

const Header = ({ back, name }: Omit<Props, 'class'>) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((isOpen) => !isOpen)
  const hideMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header class={headerStyle}>
        {back && (
          <IconButton
            icon={arrowLeft}
            aria-label="Back"
            {...{ [typeof back === 'string' ? 'href' : 'onClick']: back }}
          />
        )}
        <h1 class={headerText}>{name}</h1>
        <IconButton icon={menu} onClick={toggleMenu} aria-label="Open Menu" />
      </header>
      <Menu onHide={hideMenu} visible={isMenuOpen} />
    </>
  )
}

const Page = ({
  children,
  class: className,
  wrapperClass,
  name,
  back,
  ...rest
}: RenderableProps<Props>) => {
  return (
    <ErrorBoundary>
      <div class={clsx(wrapperClass)} {...rest}>
        <Header name={name} back={back} />
        <main class={clsx(className)}>{children}</main>
      </div>
    </ErrorBoundary>
  )
}

export default Page
