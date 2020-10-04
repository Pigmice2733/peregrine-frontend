import { usePromise } from '@/utils/use-promise'
import { getUser } from '@/api/user/get-user'
import { formatUserName } from '@/utils/format-user-name'
import Icon from './icon'
import { css } from 'linaria'
import { mdiAccountCircle } from '@mdi/js'
import { pigmicePurple } from '@/colors'

export const ProfileLink = ({
  reporterId,
  link = true,
}: {
  reporterId: number | null | undefined
  link?: boolean
}) => {
  const reporter = usePromise(() => {
    if (reporterId !== undefined && reporterId !== null) {
      return getUser(reporterId).catch(() => undefined)
    }
  }, [reporterId])
  const showLink = reporterId !== null && link
  const El = showLink ? 'a' : 'div'
  return (
    <El
      href={showLink ? `/users/${reporterId}` : undefined}
      class={reporterStyle}
    >
      <Icon icon={mdiAccountCircle} />
      {formatUserName(reporter, reporterId)}
    </El>
  )
}

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
