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
  transition: all 0.3s ease;
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
  width: 20rem;
  height: 100%;
  background: white;
  box-shadow: ${createShadow(16)};
  z-index: 16;
  transition: inherit;
  transition-timing-function: cubic-bezier(1, 0, 0.71, 0.88);
  display: flex;
  flex-direction: column;
  padding: ${spacing};

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

export const Menu = ({ onHide, visible }: Props) => {
  const { jwt } = useJWT()
  const isAdmin = jwt && jwt.peregrineRoles.isAdmin

  return (
    <Scrim visible={visible} onClickOutside={onHide} key="scrim">
      <aside class={menuStyle}>
        <IconButton
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
      </aside>
    </Scrim>
  )
}
