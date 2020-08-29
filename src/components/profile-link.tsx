import { usePromise } from '@/utils/use-promise'
import { getUser } from '@/api/user/get-user'
import { formatUserName } from '@/utils/format-user-name'
import Icon from './icon'
import { h } from 'preact'
import { css } from 'linaria'
import { mdiAccountCircle } from '@mdi/js'
import { pigmicePurple } from '@/colors'

export const ProfileLink = ({
  reporterId,
}: {
  reporterId: number | null | undefined
}) => {
  const reporter = usePromise(() => {
    if (reporterId !== undefined && reporterId !== null) {
      return getUser(reporterId).catch(() => undefined)
    }
  }, [reporterId])
  const El = reporterId === null ? 'div' : 'a'
  return (
    <El
      href={reporterId === null ? undefined : `/users/${reporterId}`}
      class={reporterStyle}
    >
      <Icon icon={mdiAccountCircle} />
      {formatUserName(reporter, reporterId)}
    </El>
  )
}

// TODO: Next week add a prop to disable linking

const reporterStyle = css`
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &[href]:hover,
  &:focus {
    color: ${pigmicePurple};
  }
  & > :first-child {
    padding-right: 0.2rem;
  }
`
