import InfoGroupCard from './info-group-card'
import {
  mdiMapMarker as mapMarker,
  mdiGoogleMaps as googleMaps,
  mdiInformationOutline as infoOutline,
  mdiCalendar as calendar,
  mdiCalendarPlus as calendarPlus,
  mdiVideo as video,
  mdiYoutube as youtube,
  mdiTwitch as twitch,
} from '@mdi/js'
import Icon from './icon'
import Chip from './chip'
import { formatDateRange } from '@/utils/format-date-range'
import IconButton from './icon-button'
import { ProcessedEventInfo } from '@/api/event-info'

const gcalDate = (date: Date, dateOffset = 0) => {
  return (
    String(date.getFullYear()) +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate() + dateOffset).padStart(2, '0')
  )
}

const webcastIcon = (url: string) => (/youtube/i.exec(url) ? youtube : twitch)

const gcalUrl = ({
  name,
  startDate,
  endDate,
  locationName,
}: {
  name: string
  startDate: Date
  endDate: Date
  locationName: string
}) =>
  `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    name,
  )}&dates=${gcalDate(startDate)}/${gcalDate(
    endDate,
    1,
  )}&location=${encodeURIComponent(locationName)}`

interface Props {
  event: ProcessedEventInfo
}

export const EventInfoCard = ({ event }: Props) => (
  <InfoGroupCard
    info={[
      event.locationName &&
        event.gmapsUrl && {
          icon: mapMarker,
          title: event.locationName,
          href: event.gmapsUrl,
          target: '_blank',
          rel: 'noopener',
          action: <Icon icon={googleMaps} />,
        },
      event.district && {
        icon: infoOutline,
        title: (
          <span>
            {(event as { fullDistrict: string }).fullDistrict}{' '}
            <Chip>{event.district}</Chip>
          </span>
        ),
      },
      {
        icon: calendar,
        title: (
          <span>
            {formatDateRange(event.startDate, event.endDate)}{' '}
            {event.week !== undefined && <Chip>{`Wk ${event.week + 1}`}</Chip>}
          </span>
        ),
        action: (
          <IconButton
            href={gcalUrl(event)}
            target="_blank"
            rel="noopener"
            icon={calendarPlus}
          />
        ),
      },
      event.webcasts.length > 0 && {
        icon: video,
        title: 'Live Stream' + (event.webcasts.length === 1 ? '' : 's'),
        href: event.webcasts.length === 1 ? event.webcasts[0] : undefined,
        target: '_blank',
        rel: 'noopener',
        action:
          event.webcasts.length === 1 ? (
            <Icon icon={webcastIcon(event.webcasts[0])} />
          ) : (
            event.webcasts.map((w) => (
              <IconButton
                key={w}
                icon={webcastIcon(w)}
                href={w}
                target="_blank"
                rel="noopener"
              />
            ))
          ),
      },
    ]}
  />
)
