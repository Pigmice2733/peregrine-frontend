import { pigmicePurple } from '@/colors'
import Icon from '@/components/icon'
import { Scrim, scrimHiddenClass } from '@/components/scrim'
import { accountCircle } from '@/icons/account-circle'
import { close as closeIcon } from '@/icons/close'
import { crown } from '@/icons/crown'
import { home } from '@/icons/home'
import { login } from '@/icons/login'
import { logout as logoutIcon } from '@/icons/logout'
import { logout, useJWT } from '@/jwt'
import { createShadow } from '@/utils/create-shadow'
import { getScrollbarWidth } from '@/utils/get-scrollbar-width'
import { resolveUrl } from '@/utils/resolve-url'
import clsx from 'clsx'
import { css } from 'linaria'
import { darken, lighten, rgba } from 'polished'
import { ComponentChildren, h } from 'preact'
import IconButton from './icon-button'

const spacing = '0.3rem'

interface MenuItemProps {
  children: ComponentChildren
  icon: string
  href?: string
  onClick?: (e: Event) => void
}

const menuItemStyle = css`
  display: flex;

  & > * {
    &:hover,
    &:focus {
      background: ${rgba('black', 0.08)};
      outline: none;
    }
    text-decoration: none;
    padding: 0.6rem 0.7rem;
    border-radius: 0.3rem;
    margin: ${spacing};
    color: ${lighten(0.26, 'black')};
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    font: inherit;
    font-weight: 500;
    background: transparent;
    border: none;
    width: 100%;
    cursor: pointer;
  }
`

const activeStyle = css`
  color: ${darken(0.06, pigmicePurple)};
  background: ${rgba(pigmicePurple, 0.15)};
`

const textStyle = css`
  margin-left: 1.2rem;
`

const MenuItem = ({ href, children, icon, onClick }: MenuItemProps) => {
  const isActive = href && resolveUrl(href) === window.location.href

  const El = href ? 'a' : 'button'

  return (
    <li class={menuItemStyle}>
      <El class={clsx(isActive && activeStyle)} href={href} onClick={onClick}>
        <Icon icon={icon} />
        <span class={textStyle}>{children}</span>
      </El>
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
  transition: inherit;
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
    transform: translateX(100%);
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

const logoutHandler = () => {
  logout()
  window.location.reload()
}

export const Menu = ({ onHide, visible }: Props) => {
  const { jwt } = useJWT()
  const isAdmin = jwt && jwt.peregrineRoles.isAdmin
  const isLoggedIn = jwt

  return (
    <Scrim visible={visible} onClickOutside={onHide}>
      <aside class={menuStyle}>
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
          {isLoggedIn ? (
            <MenuItem icon={logoutIcon} onClick={logoutHandler}>
              Log out
            </MenuItem>
          ) : (
            <MenuItem icon={login} href="/login">
              Log in
            </MenuItem>
          )}
        </ul>
      </aside>
    </Scrim>
  )
}
