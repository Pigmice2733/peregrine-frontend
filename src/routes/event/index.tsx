import { h } from 'preact'
import LoadData from '../../load-data'
import Page from '../../components/page'
import { getEventMatches, getEventInfo } from '../../api'
import { MatchCard } from '../../components/match-card'
import InfoGroupCard from '../../components/info-group-card'
import {
  mapMarker,
  infoOutline,
  calendar,
  googleMaps,
  video,
} from '../../icons'
import { formatDateRange } from '../../utils'
import Icon from '../../components/icon'
import Chip from '../../components/chip'

interface Props {
  eventKey: string
}

const gmapsUrl = (lat: number, lon: number) =>
  `https://www.google.com/maps/?q=${lat},${lon}`

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
      >
        <div>
          {eventInfo && (
            <div>
              <InfoGroupCard
                info={[
                  eventInfo.location.name && {
                    icon: mapMarker,
                    title: eventInfo.location.name,
                    href: gmapsUrl(
                      eventInfo.location.lat,
                      eventInfo.location.lon,
                    ),
                    target: 'blank',
                    action: <Icon icon={googleMaps} />,
                  },
                  eventInfo.district && {
                    icon: infoOutline,
                    title: eventInfo.district.toUpperCase(),
                    action: <Chip>{eventInfo.district}</Chip>,
                  },
                  {
                    icon: calendar,
                    title: formatDateRange(
                      eventInfo.startDate,
                      eventInfo.endDate,
                    ),
                    action: eventInfo.week !== undefined && (
                      <Chip>{`Wk ${eventInfo.week + 1}`}</Chip>
                    ),
                  },
                  {
                    icon: video,
                    title: 'Live Stream',
                    action: <pre>{eventInfo.webcasts[0]}</pre>,
                  },
                ]}
              />
            </div>
          )}
          <div>
            {matches && matches.map(m => <MatchCard key={m.key} match={m} />)}
          </div>
        </div>
      </Page>
    )}
    renderError={({ matches }) => <h1>Error loading matches: {matches}</h1>}
  />
)

export default Event
