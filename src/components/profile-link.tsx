import { usePromise } from 'src/utils/use-promise'
import { formatUserName } from 'src/utils/format-user-name'
import Icon from './icon'
import { css } from '@linaria/core'
import { mdiAccountCircle } from '@mdi/js'
import { pigmicePurple } from 'src/colors'
import { getFastestUser } from 'src/cache/users/get-fastest'

export const ProfileLink = ({
  reporterId,
  link = true,
}: {
  reporterId: number | null | undefined
  link?: boolean
}) => {
  const reporter = usePromise(() => {
    if (reporterId !== undefined && reporterId !== null) {
      return getFastestUser(reporterId).catch(() => undefined)
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
