import Card, { CardProps } from './card'
import {
  useNetworkConnection,
  ConnectionType,
} from '@/utils/use-network-connection'
import clsx from 'clsx'
import { css } from 'linaria'
import { useState, useEffect } from 'preact/hooks'
import Icon from './icon'
import { mdiPlay } from '@mdi/js'

const videoCardStyle = css`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  overflow: hidden;
  z-index: 1;
  position: relative;
  div& {
    background: black;
  }
  &:before {
    display: block;
    content: '';
    width: 100%;
    padding-top: calc(9 / 16 * 100%);
  }
  > *,
  &:before {
    grid-column: 1;
    grid-row: 1;
    width: 100%;
    align-self: stretch;
  }

  & svg {
    justify-self: center;
    width: 4rem;
    color: white;
  }
`

export const VideoCard = ({
  url,
  ...props
}: { url: string } & Omit<CardProps<'div'>, 'as'>) => {
  const connection = useNetworkConnection()
  const [loadVideo, setLoadVideo] = useState(false)
  useEffect(() => {
    if (connection === ConnectionType.Default) setLoadVideo(true)
    else if (connection === ConnectionType.Offline) setLoadVideo(false)
  }, [connection])
  if (connection === ConnectionType.Offline) return null
  return (
    <Card
      as="div"
      onClick={() => setLoadVideo(true)}
      {...props}
      class={clsx(
        props.class,
        videoCardStyle,
        !loadVideo &&
          css`
            cursor: pointer;
          `,
      )}
    >
      {loadVideo ? (
        // eslint-disable-next-line caleb/jsx-a11y/iframe-has-title
        <iframe frameBorder={0} allowFullScreen src={url} />
      ) : (
        <Icon icon={mdiPlay} />
      )}
    </Card>
  )
}
