import { h } from 'preact'
import LoadData from '@/load-data'
import Page from '@/components/page'
import { MatchCard } from '@/components/match-card'
import InfoGroupCard from '@/components/info-group-card'
import { calendarPlus } from '@/icons/calendar-plus'
import { calendar } from '@/icons/calendar'
import { twitch } from '@/icons/twitch'
import { youtube } from '@/icons/youtube'
import { mapMarker } from '@/icons/map-marker'
import { googleMaps } from '@/icons/google-maps'
import { infoOutline } from '@/icons/info-outline'
import { video } from '@/icons/video'
import { formatDateRange } from '@/utils/format-date-range'
import Icon from '@/components/icon'
import Chip from '@/components/chip'
import style from './style.css'
import IconButton from '@/components/icon-button'
import Spinner from '@/components/spinner'
import { getEventMatches } from '@/api/match-info/get-event-matches'
import { getEventInfo } from '@/api/event-info/get-event-info'

interface Props {
  eventKey: string
}

const icons = { twitch, youtube }

const gmapsUrl = (lat: number, lon: number) =>
  `https://www.google.com/maps/?q=${lat},${lon}`

const gcalDate = (date: Date, dateOffset = 0) => {
  return (
    String(date.getFullYear()) +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate() + dateOffset).padStart(2, '0')
  )
}

const gcalUrl = ({
  name,
  startDate,
  endDate,
  location,
}: {
  name: string
  startDate: Date
  endDate: Date
  location: { name: string }
}) =>
  `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    name,
  )}&dates=${gcalDate(startDate)}/${gcalDate(
    endDate,
    1,
  )}&location=${encodeURIComponent(location.name)}`

const Event = ({ eventKey }: Props) => (
  <LoadData
    data={{
      matches: () => getEventMatches(eventKey),
      eventInfo: () => getEventInfo(eventKey),
    }}
    renderSuccess={({ matches, eventInfo }) => (
      <Page
        name={(eventInfo && eventInfo.name) || <code>{eventKey}</code>}
        back="/"
        tabs={[
          {
            name: 'Info',
            contents: (
              <div class={style.event}>
                {eventInfo ? (
                  <InfoGroupCard
                    info={[
                      eventInfo.location.name && {
                        icon: mapMarker,
                        title: eventInfo.location.name,
                        href: gmapsUrl(
                          eventInfo.location.lat,
                          eventInfo.location.lon,
                        ),
                        target: '_blank',
                        rel: 'noopener',
                        action: <Icon icon={googleMaps} />,
                      },
                      eventInfo.district && {
                        icon: infoOutline,
                        title: (
                          <span>
                            {
                              (eventInfo as { fullDistrict: string })
                                .fullDistrict
                            }{' '}
                            <Chip>{eventInfo.district}</Chip>
                          </span>
                        ),
                      },
                      {
                        icon: calendar,
                        title: (
                          <span>
                            {formatDateRange(
                              eventInfo.startDate,
                              eventInfo.endDate,
                            )}{' '}
                            {eventInfo.week !== undefined && (
                              <Chip>{`Wk ${eventInfo.week + 1}`}</Chip>
                            )}
                          </span>
                        ),
                        action: (
                          <IconButton
                            href={gcalUrl(eventInfo)}
                            target="_blank"
                            rel="noopener"
                            icon={calendarPlus}
                          />
                        ),
                      },
                      eventInfo.webcasts.length > 0 && {
                        icon: video,
                        title:
                          'Live Stream' +
                          (eventInfo.webcasts.length === 1 ? '' : 's'),
                        href:
                          eventInfo.webcasts.length === 1
                            ? eventInfo.webcasts[0].url
                            : undefined,
                        target: '_blank',
                        rel: 'noopener',
                        action:
                          eventInfo.webcasts.length === 1 ? (
                            <Icon icon={icons[eventInfo.webcasts[0].type]} />
                          ) : (
                            eventInfo.webcasts.map(i => (
                              <IconButton
                                key={i.url}
                                icon={icons[i.type]}
                                href={i.url}
                                target="_blank"
                                rel="noopener"
                              />
                            ))
                          ),
                      },
                    ]}
                  />
                ) : (
                  <Spinner />
                )}
              </div>
            ),
          },
          {
            name: 'Matches',
            contents: matches ? (
              matches.map(m => (
                <MatchCard
                  key={m.key}
                  match={m}
                  href={`/events/${eventKey}/matches/${m.key}`}
                />
              ))
            ) : (
              <Spinner />
            ),
          },
        ]}
      />
    )}
    renderError={({ matches }) => <h1>Error loading matches: {matches}</h1>}
  />
)

export default Event
