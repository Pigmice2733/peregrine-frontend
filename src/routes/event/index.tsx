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
import { getSchema } from '@/api/schema/get-schema'
import AnalysisTable from '@/components/analysis-table'
import { getEventStats } from '@/api/stats/get-event-stats'

interface Props {
  eventKey: string
}

const gmapsUrl = (lat: number, lon: number) =>
  `https://www.google.com/maps/?q=${lat},${lon}`

const gcalDate = (date: Date, dateOffset = 0) => {
  return (
    String(date.getFullYear()) +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate() + dateOffset).padStart(2, '0')
  )
}

const webcastIcon = (url: string) => (url.match(/youtube/i) ? youtube : twitch)

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

const Event = ({ eventKey }: Props) => (
  <LoadData
    data={{
      matches: () => getEventMatches(eventKey),
      eventInfo: () => getEventInfo(eventKey),
      eventStats: () => getEventStats(eventKey),
      schema: () => getEventInfo(eventKey).then(e => getSchema(e.schemaId)),
    }}
    renderSuccess={({ matches, eventInfo, eventStats, schema }) => {
      const now = new Date()
      const nextMatch = matches
        ? matches.find(m => m.time !== undefined && m.time > now) || matches[0]
        : undefined

      return (
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
                        eventInfo.locationName && {
                          icon: mapMarker,
                          title: eventInfo.locationName,
                          href: gmapsUrl(eventInfo.lat, eventInfo.lon),
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
                              ? eventInfo.webcasts[0]
                              : undefined,
                          target: '_blank',
                          rel: 'noopener',
                          action:
                            eventInfo.webcasts.length === 1 ? (
                              <Icon icon={webcastIcon(eventInfo.webcasts[0])} />
                            ) : (
                              eventInfo.webcasts.map(w => (
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
                  ) : (
                    <Spinner />
                  )}
                  {nextMatch ? (
                    <MatchCard
                      key={nextMatch.key}
                      match={nextMatch}
                      href={`/events/${eventKey}/matches/${nextMatch.key}`}
                    />
                  ) : (
                    <Spinner />
                  )}
                </div>
              ),
            },
            {
              name: 'Teams',
              contents: (
                <div class={style.teamsView}>
                  {eventStats && schema ? (
                    <AnalysisTable
                      teams={eventStats}
                      schema={schema}
                      renderTeam={team => (
                        <a href={`/events/${eventKey}/teams/${team}`}>{team}</a>
                      )}
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
      )
    }}
  />
)

export default Event
