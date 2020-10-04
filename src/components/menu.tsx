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
import { ComponentChildren } from 'preact'
import IconButton from './icon-button'
import { useSavedReports } from '@/api/report/submit-report'
import { cloudSync } from '@/icons/cloud-sync'
import { accountPlus } from '@/icons/account-plus'
import { mdiStarCircle } from '@mdi/js'
import { useSavedTeams } from '@/api/save-teams'
import { useEventInfo } from '@/cache/event-info/use'

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
  display: grid;
  grid-template-rows: auto 1fr;
  padding: ${spacing};
  will-change: transform;
  overflow: hidden;

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
  justify-self: end;
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

const navStyle = css`
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  height: 100%;
  overflow: hidden;
`
const savedTeamsStyle = css`
  overflow: auto;
`
const savedTeamsLabelStyle = css`
  font-weight: bold;
  padding: 0.1rem 0.9rem;
  margin: 0;
  font-size: 1.1rem;
`

const SavedTeamMenuItem = ({
  eventKey,
  teamNum,
}: {
  eventKey: string
  teamNum: string
}) => {
  const eventInfo = useEventInfo(eventKey)
  return (
    <MenuItem
      icon={mdiStarCircle}
      href={`/events/${eventKey}/teams/${teamNum}`}
    >
      {teamNum} - {eventInfo ? eventInfo.name : eventKey}
    </MenuItem>
  )
}

export const Menu = ({ onHide, visible }: Props) => {
  const { jwt } = useJWT()
  const isAdmin = jwt?.peregrineRoles.isAdmin
  const isLoggedIn = jwt
  const savedReports = useSavedReports()
  const savedTeams = useSavedTeams()
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
        <nav class={navStyle}>
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
            {savedReports.length > 0 && (
              <MenuItem icon={cloudSync} href="/saved-reports">
                Offline Saved Reports
              </MenuItem>
            )}
          </ul>
          <h2 class={savedTeamsLabelStyle}>Saved Teams</h2>
          <ul class={savedTeamsStyle}>
            {savedTeams.map(({ teamNum, eventKey }) => (
              <SavedTeamMenuItem
                key={`${teamNum}:${eventKey}`}
                teamNum={teamNum}
                eventKey={eventKey}
              />
            ))}
          </ul>
          <ul>
            {jwt && (
              <MenuItem icon={accountCircle} href={`/users/${jwt.sub}`}>
                Profile
              </MenuItem>
            )}
            {isLoggedIn ? (
              <MenuItem icon={logoutIcon} onClick={logoutHandler}>
                Log out
              </MenuItem>
            ) : (
              <>
                <MenuItem icon={login} href="/login">
                  Log in
                </MenuItem>
                <MenuItem icon={accountPlus} href="/signup">
                  Sign Up
                </MenuItem>
              </>
            )}
          </ul>
        </nav>
      </aside>
    </Scrim>
  )
}
