import { render, fireEvent } from 'preact-testing-library'
import { ScoutPage } from '.'
import { h } from 'preact'
import { MatchInfo } from '@/api/match-info'
import { EventInfo } from '@/api/event-info'
import { Schema } from '@/api/schema'
import { BaseReport } from '@/api/report'

const nextTick = () => new Promise(resolve => setImmediate(resolve))

const matchInfo: MatchInfo = {
  key: 'qm3',
  redAlliance: ['frc254', 'frc2471', 'frc973'],
  blueAlliance: ['frc971', 'frc2733', 'frc118'],
}

const eventInfo: EventInfo = {
  name: 'Wilsonville',
  webcasts: [],
  schemaId: 1000,
  startDate: '2018-12-22T16:00:00Z',
  endDate: '2018-12-23T04:00:00Z',
  locationName: 'nowhere',
  lat: 0,
  lon: 0,
  key: '2018orwil',
}

const schema: Schema = {
  id: 1000,
  auto: [
    { name: 'Crossed Line', type: 'boolean' },
    { name: 'Switch Cubes', type: 'number' },
  ],
  teleop: [
    { name: 'Scale Cubes', type: 'number' },
    { name: 'Climbed', type: 'boolean' },
  ],
}

const report: BaseReport = {
  autoName: 'Very Cool Auto',
  data: {
    teleop: [
      { name: 'Scale Cubes', attempts: 5, successes: 3 },
      { name: 'Climbed', attempts: 0, successes: 0 },
    ],
    auto: [
      { name: 'Crossed Line', attempts: 1, successes: 0 },
      { name: 'Switch Cubes', attempts: 0, successes: 0 },
    ],
  },
}

const createResponse = (data: any) =>
  new Response(JSON.stringify({ data }), {
    headers: { 'Content-Type': 'application/json' },
  })

test('renders and submits', async () => {
  jest.spyOn(window, 'fetch').mockImplementation(async (req: RequestInfo) => {
    const url = typeof req === 'string' ? req : req.url
    if (url.endsWith('/events/2018orwil/matches/qm3')) {
      return createResponse(matchInfo)
    }
    if (url.endsWith('/events/2018orwil')) {
      return createResponse(eventInfo)
    }
    if (url.endsWith('/schemas/1000')) {
      return createResponse(schema)
    }
    if (url.endsWith('/reports/frc254')) {
      return createResponse(null)
    }
    throw new Error(`Unrecognized parameters to fetch: ${url}`)
  })

  const scoutPage = render(<ScoutPage eventKey="2018orwil" matchKey="qm3" />)

  const submitButton = scoutPage.getByText(/submit/i)

  expect(submitButton).toBeDisabled()

  await nextTick()

  expect(window.fetch).toHaveBeenCalledTimes(3)

  expect(window.fetch).toHaveBeenCalledWith(
    expect.stringMatching(/\/events\/2018orwil\/matches\/qm3$/),
    { body: undefined, headers: {}, method: 'GET' },
  )

  expect(window.fetch).toHaveBeenCalledWith(
    expect.stringMatching(/\/events\/2018orwil$/),
    { body: undefined, headers: {}, method: 'GET' },
  )

  expect(window.fetch).toHaveBeenLastCalledWith(
    expect.stringMatching(/\/schemas\/1000/),
    { body: undefined, headers: {}, method: 'GET' },
  )

  expect(submitButton).toBeDisabled()

  fireEvent.click(scoutPage.getByLabelText('254'))

  expect(submitButton).toBeDisabled()

  const autoInput = scoutPage.getByLabelText(/auto name/i) as HTMLInputElement
  autoInput.value = 'very  cool auto'
  autoInput.dispatchEvent(new Event('input'))

  const scaleCubesDiv = scoutPage.getByText(/scale cubes/i)
    .parentElement as HTMLDivElement
  const [successesInput, failuresInput] = (scaleCubesDiv.querySelectorAll(
    'input',
  ) as unknown) as HTMLInputElement[]
  successesInput.valueAsNumber = 3
  fireEvent.change(successesInput)
  await nextTick()
  failuresInput.valueAsNumber = 2
  fireEvent.change(failuresInput)

  const crossedLineDiv = scoutPage.getByText(/crossed line/i)
    .parentElement as HTMLDivElement
  const attemptedBox = crossedLineDiv.querySelector(
    'input[value=Attempted]',
  ) as HTMLInputElement
  attemptedBox.checked = true
  fireEvent.change(attemptedBox)

  expect(submitButton).not.toBeDisabled()

  fireEvent.submit(scoutPage.container.querySelector('form') as HTMLFormElement)

  await nextTick()

  expect(window.fetch).toHaveBeenCalledTimes(4)
  expect(window.fetch).toHaveBeenLastCalledWith(
    expect.stringMatching(
      /\/events\/2018orwil\/matches\/qm3\/reports\/frc254$/,
    ),
    {
      body: JSON.stringify(report),
      headers: {},
      method: 'PUT',
    },
  )
})
