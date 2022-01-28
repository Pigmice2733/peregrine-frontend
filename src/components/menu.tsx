import { offBlack, pigmicePurple, textGrey } from '@/colors'
import Icon from '@/components/icon'
import { Scrim, scrimHiddenClass } from '@/components/scrim'
import {
  mdiAccountCircle,
  mdiClose,
  mdiCrown,
  mdiHome,
  mdiAccountPlus,
  mdiStarCircle,
  mdiLoginVariant,
  mdiLogoutVariant,
  mdiCloudUpload,
  mdiAutorenew,
} from '@mdi/js'
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

import { useSavedTeams } from '@/api/save-teams'
import { useEventInfo } from '@/cache/event-info/use'
import { useEffect, useState } from 'preact/hooks'

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
          icon={mdiClose}
          onClick={onHide}
          class={closeButtonStyle}
          style={{ marginRight: getScrollbarWidth() }}
        />
        <nav class={navStyle}>
          <ul>
            <MenuItem icon={mdiHome} href="/">
              Home
            </MenuItem>
            <MenuItem icon={mdiCrown} href="/leaderboard">
              Leaderboard
            </MenuItem>
            {isAdmin && (
              <MenuItem icon={mdiAccountCircle} href="/users">
                Users
              </MenuItem>
            )}
            {savedReports.length > 0 && (
              <MenuItem icon={mdiCloudUpload} href="/saved-reports">
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
              <MenuItem icon={mdiAccountCircle} href={`/users/${jwt.sub}`}>
                Profile
              </MenuItem>
            )}
            {isLoggedIn ? (
              <MenuItem icon={mdiLogoutVariant} onClick={logoutHandler}>
                Log out
              </MenuItem>
            ) : (
              <>
                <MenuItem
                  icon={mdiLoginVariant}
                  href={`/login?from=${encodeURIComponent(location.pathname)}`}
                >
                  Log in
                </MenuItem>
                <MenuItem icon={mdiAccountPlus} href="/signup">
                  Sign Up
                </MenuItem>
              </>
            )}
          </ul>
          <VersionInfo />
        </nav>
      </aside>
    </Scrim>
  )
}

const versionInfoStyle = css`
  font-family: monospace;
  text-align: center;
  font-size: 0.8rem;
  padding: 0.3rem;
  color: ${textGrey};
`

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data === 'refresh') {
      location.reload()
    }
  })
}

const VersionInfo = () => {
  const [isNewVersionAvailable, setIsNewVersionAvailable] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const checkForNewVersion = () => {
      navigator.serviceWorker.getRegistration().then((registration) => {
        setIsNewVersionAvailable(
          registration ? registration.waiting !== null : false,
        )
      })
    }
    checkForNewVersion()
    const listenForNewVersion = (event: MessageEvent) => {
      if (event.data !== 'new version') return
      checkForNewVersion()
    }
    navigator.serviceWorker.addEventListener('message', listenForNewVersion)
    return () =>
      navigator.serviceWorker.removeEventListener(
        'message',
        listenForNewVersion,
      )
  }, [])

  return (
    <>
      {process.env.BRANCH && process.env.COMMIT_REF && (
        <div class={versionInfoStyle}>{`${
          process.env.BRANCH
        }-${process.env.COMMIT_REF.slice(0, 7)}`}</div>
      )}
      {isNewVersionAvailable && (
        <button
          class={newVersionButtonStyle}
          disabled={isRefreshing}
          onClick={async () => {
            setIsRefreshing(true)
            const registration = await navigator.serviceWorker.getRegistration()
            if (!registration) return
            registration.waiting?.postMessage('refresh')
          }}
        >
          {isRefreshing ? 'Updating...' : 'New Version Available'}
          {!isRefreshing && (
            <Icon class={updateButtonIconStyle} icon={mdiAutorenew} />
          )}
        </button>
      )}
    </>
  )
}

const newVersionButtonStyle = css`
  border: 0;
  background: transparent;
  text-decoration: underline;
  color: #3976b7;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  &[disabled] {
    color: ${offBlack};
    text-decoration: none;
    cursor: default;
  }
`

const updateButtonIconStyle = css`
  width: 1rem;
  height: 1rem;
  fill: currentColor;
`
