import { compareEvents, PartialEvent, EventWithLocation } from '.'
import { LatLong } from '../use-geo-location'

const time = (num: number) => new Date(num)
const now = time(0)
const userLocation: LatLong = { latitude: 0, longitude: 0 }

const currentNearbyEvent: EventWithLocation = {
  name: 'Current Nearby',
  startDate: time(-1),
  endDate: time(3),
  lat: 0.5,
  lon: 0.5,
}

const currentFarEvent: EventWithLocation = {
  name: 'Current Far a',
  startDate: time(-3),
  endDate: time(5),
  lat: 2,
  lon: 2,
}

const currentFarEvent2: EventWithLocation = {
  name: 'Current Far b',
  startDate: time(-3),
  endDate: time(5),
  lat: 2,
  lon: 2,
}

const pastEvent: PartialEvent = {
  name: 'Past',
  startDate: time(-100),
  endDate: time(-2),
}

const farPastEvent: PartialEvent = {
  name: 'Far Past',
  startDate: time(-300),
  endDate: time(-301),
}

const futureEvent: PartialEvent = {
  name: 'Future',
  startDate: time(3),
  endDate: time(5),
}

const futureOtherEvent: PartialEvent = {
  name: 'Other equal future',
  startDate: time(3),
  endDate: time(5),
}

const farFutureEvent: PartialEvent = {
  name: 'Far Future',
  startDate: time(4),
  endDate: time(5),
}

const expectOrder = (
  a: PartialEvent,
  b: PartialEvent,
  comparer: (a: PartialEvent, b: PartialEvent) => number,
) => {
  let items: PartialEvent[] = []
  try {
    expect((items = [a, b]).sort(comparer)).toEqual([a, b])
    expect((items = [b, a]).sort(comparer)).toEqual([a, b])
  } catch {
    throw new Error(
      `${items.map((i) => i.name).join(', ')}

Should have been sorted in this order:

${[a.name, b.name].join(', ')}`,
    )
  }
}

test('two current events are sorted by location', () => {
  expectOrder(
    currentNearbyEvent,
    currentFarEvent,
    compareEvents(now, userLocation),
  )
})

test('two current events are sorted by name if there is no location', () => {
  expectOrder(currentFarEvent, currentNearbyEvent, compareEvents(now))
})

test('two current events are sorted by name if locations are equal', () => {
  expectOrder(currentFarEvent, currentFarEvent2, compareEvents(now))
})

test('current events are before past events', () => {
  expectOrder(currentFarEvent, pastEvent, compareEvents(now))
})

test('current events are before future events', () => {
  expectOrder(currentFarEvent, futureEvent, compareEvents(now))
})

test('future events are before past events', () => {
  expectOrder(futureEvent, pastEvent, compareEvents(now))
})

test('events with the same time get sorted by name', () => {
  expectOrder(futureEvent, futureOtherEvent, compareEvents(now))
})

test('two future events are sorted by soonest start', () => {
  expectOrder(futureEvent, farFutureEvent, compareEvents(now))
})

test('two past events are sorted by most recent end', () => {
  expectOrder(pastEvent, farPastEvent, compareEvents(now))
})
