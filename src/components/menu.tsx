import { h, ComponentChildren } from 'preact'
import { css } from 'linaria'
import { createShadow } from '@/utils/create-shadow'
import { Scrim, scrimHiddenClass } from '@/components/scrim'
import { useJWT } from '@/jwt'
import { pigmicePurple } from '@/colors'
import { rgba, darken, lighten } from 'polished'
import { crown } from '@/icons/crown'
import { close as closeIcon } from '@/icons/close'
import { accountCircle } from '@/icons/account-circle'
import Icon from '@/components/icon'
import IconButton from './icon-button'
import { getScrollbarWidth } from '@/utils/get-scrollbar-width'
import { home } from '@/icons/home'
import clsx from 'clsx'
import { resolveUrl } from '@/utils/resolve-url'
import { initSpring, Animated } from '@/spring/use'
import { useState } from 'preact/hooks'

const spacing = '0.3rem'

interface MenuItemProps {
  href: string
  children: ComponentChildren
  icon: string
}
const activeStyle = css``
const menuItemStyle = css`
  text-decoration: none;
  padding: 0.6rem 0.7rem;
  border-radius: 0.3rem;
  margin: ${spacing};
  color: ${lighten(0.26, 'black')};
  transition: box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  font-weight: 500;

  &:hover,
  &:focus {
    background: ${rgba('black', 0.08)};
    outline: none;
  }

  &.${activeStyle} {
    color: ${darken(0.06, pigmicePurple)};
    background: ${rgba(pigmicePurple, 0.15)};
  }
`
const textStyle = css`
  margin-left: 1.2rem;
`
const MenuItem = ({ href, children, icon }: MenuItemProps) => {
  const isActive = resolveUrl(href) === window.location.href
  return (
    <li>
      <a class={clsx(isActive && activeStyle, menuItemStyle)} href={href}>
        <Icon icon={icon} />
        <span class={textStyle}>{children}</span>
      </a>
    </li>
  )
}

const menuStyle = css`
  position: fixed;
  right: 0;
  top: 0;
  width: 20rem;
  max-width: 90vw;
  height: 100%;
  background: white;
  box-shadow: ${createShadow(16)};
  z-index: 16;
  /* transition: inherit; */
  transition-timing-function: cubic-bezier(1, 0, 0.71, 0.88);
  display: flex;
  flex-direction: column;
  padding: ${spacing};
  will-change: transform;

  & ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .${scrimHiddenClass} & {
    box-shadow: none;
  }
`

const closeButtonStyle = css`
  align-self: flex-end;
  margin: 0;
`

interface Props {
  onHide: () => void
  visible: boolean
}

export const Menu = ({ onHide, visible }: Props) => {
  const { jwt } = useJWT()
  const isAdmin = jwt && jwt.peregrineRoles.isAdmin
  const spring = initSpring()

  return (
    <Scrim visible={visible} onClickOutside={onHide}>
      <Animated.aside
        class={menuStyle}
        style={spring({
          transform: spring`translateX(${visible ? 0 : 100}%)`,
        })}
      >
        <IconButton
          aria-label="Close Menu"
          icon={closeIcon}
          onClick={onHide}
          class={closeButtonStyle}
          style={{ marginRight: getScrollbarWidth() }}
        />
        <ul>
          <MenuItem icon={home} href="/">
            Home
          </MenuItem>
          <MenuItem icon={crown} href="/leaderboard">
            Leaderboard
          </MenuItem>
          {isAdmin && (
            <MenuItem icon={accountCircle} href="/users">
              Users
            </MenuItem>
          )}
        </ul>
      </Animated.aside>
    </Scrim>
  )
}

const TextAnimated = () => {
  const spring = initSpring()
  const [counter, setCounter] = useState(0)
  const increment = () => setCounter(c => c + 1)
  const decrement = () => setCounter(c => c - 1)

  return (
    <div>
      <button onClick={increment}>+</button>
      <Animated.div>{spring(counter)}</Animated.div>
      <button onClick={decrement}>-</button>
    </div>
  )
}
