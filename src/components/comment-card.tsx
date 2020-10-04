import { css } from 'linaria'
import { Report } from '@/api/report'
import { usePromise } from '@/utils/use-promise'
import { getUser } from '@/api/user/get-user'
import Card from './card'
import Icon from './icon'
import { commentIcon } from '@/icons/comment'
import { formatUserName } from '@/utils/format-user-name'

const commentCardStyle = css`
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-gap: 0.4rem 0.6rem;
  padding: 0.6rem;

  & > :not(svg) {
    grid-column: 2;
    margin: 0;
  }

  & > svg {
    grid-row: 1 / 2;
    color: #7e7e7e;
  }

  & > span {
    font-family: 'Roboto Condensed', 'Roboto', sans-serif;
    font-weight: bold;
  }
`

interface Props {
  report: Report
  showReporter?: boolean
  linkToReport?: boolean
}

export const CommentCard = ({
  report,
  showReporter = true,
  linkToReport = true,
}: Props) => {
  const reporterId = report.reporterId
  const reporter = usePromise(
    () => (reporterId ? getUser(reporterId).catch(() => null) : null),
    [reporterId],
  )
  return (
    <Card
      outlined
      href={linkToReport ? `/reports/${report.id}` : undefined}
      class={commentCardStyle}
    >
      <Icon icon={commentIcon} />
      {showReporter && <span>{formatUserName(reporter, reporterId)}</span>}
      <p>{report.comment}</p>
    </Card>
  )
}
