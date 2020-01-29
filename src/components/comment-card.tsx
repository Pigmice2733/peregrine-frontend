import { h } from 'preact'
import { css } from 'linaria'
import { GetReport } from '@/api/report'
import { usePromise } from '@/utils/use-promise'
import { getUser } from '@/api/user/get-user'
import Card from './card'
import Icon from './icon'
import { commentIcon } from '@/icons/comment'
import { CancellablePromise } from '@/utils/cancellable-promise'

const nullPromise = CancellablePromise.resolve(null)

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
    grid-row: 1 / 3;
    color: #7e7e7e;
  }

  & > span {
    font-family: 'Roboto Condensed', 'Roboto', sans-serif;
    font-weight: bold;
  }
`

export const CommentCard = ({ report }: { report: GetReport }) => {
  const userId = report.reporterId
  const reporter = usePromise(
    () => (userId ? getUser(userId).catch(() => nullPromise) : nullPromise),
    [userId],
  )
  // If it is still loading, don't render
  if (reporter === undefined || !report.comment) return null
  return (
    <Card outlined as="section" class={commentCardStyle}>
      <Icon icon={commentIcon} />
      <span>
        {reporter ? `${reporter.firstName} ${reporter.lastName}` : 'Anonymous'}
      </span>
      <p>{report.comment}</p>
    </Card>
  )
}
