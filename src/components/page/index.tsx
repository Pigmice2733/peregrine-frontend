import { h, RenderableProps, ComponentChildren, Fragment } from 'preact'
import { ErrorBoundary } from '../error-boundary'
import { css } from 'linaria'
import { createShadow } from '@/utils/create-shadow'
import { pigmicePurple } from '@/colors'
import IconButton from '../icon-button'
import { arrowLeft } from '@/icons/arrow-left'
import { menu } from '@/icons/menu'
import clsx from 'clsx'
import { useState } from 'preact/hooks'
import { Menu } from '@/components/menu'

const spacing = '0.15rem'

const iconButtonStyle = css``
const headerStyle = css`
  box-shadow: ${createShadow(4)};
  position: sticky;
  top: 0;
  background: ${pigmicePurple};
  color: white;
  padding: ${spacing};
  display: flex;
  justify-content: space-between;
  z-index: 4;

  & > * {
    display: flex;
    align-items: center;
  }

  & > * > *,
  & > * > .${iconButtonStyle} {
    font-size: 1rem;
    font-weight: 700;
    margin: ${spacing};
  }
`

const headerText = css`
  padding: 0 0.6rem;
`

interface Props {
  name: ComponentChildren
  back: string | (() => void) | false
  class?: string
}

const mainStyle = css``

const Header = ({ back, name }: Omit<Props, 'class'>) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(isOpen => !isOpen)
  const hideMenu = () => setIsMenuOpen(false)

  return (
    <Fragment>
      <header class={headerStyle}>
        <div>
          {back && (
            <IconButton
              icon={arrowLeft}
              class={iconButtonStyle}
              {...{ [typeof back === 'string' ? 'href' : 'onClick']: back }}
            />
          )}
          <h1 class={headerText}>{name}</h1>
        </div>
        <div>
          <IconButton
            icon={menu}
            class={iconButtonStyle}
            onClick={toggleMenu}
          />
        </div>
      </header>
      <Menu onHide={hideMenu} visible={isMenuOpen} />
    </Fragment>
  )
}

const Page = ({
  children,
  name,
  back,
  class: className,
}: RenderableProps<Props>) => {
  return (
    <ErrorBoundary>
      <Header back={back} name={name} />
      <main class={clsx(className, mainStyle)}>{children}</main>
    </ErrorBoundary>
  )
}

export default Page
