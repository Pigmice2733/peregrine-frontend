import {
  render,
  fireEvent,
  wait,
  setPreactOptions,
} from '@calebeby/preact-testing-library'
import ScoutPage from '../../routes/scout'
import { h, options } from 'preact'
import { MatchInfo } from '@/api/match-info'
import { EventInfo } from '@/api/event-info'
import { Schema } from '@/api/schema'
import { Report } from '@/api/report'
import { mockFetch } from '@/utils/mock-fetch'

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
  schema: [
    { name: 'Crossed Line', type: 'boolean', period: 'auto' },
    { name: 'Switch Cubes', type: 'number', period: 'auto' },
    { name: 'Scale Cubes', type: 'number', period: 'teleop' },
    { name: 'Climbed', type: 'boolean', period: 'teleop' },
  ],
}

const report: Report = {
  autoName: '',
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

setPreactOptions(options)

test('renders and submits', async () => {
  mockFetch({
    '/events/2018orwil': eventInfo,
    '/schemas/1000': schema,
    '/events/2018orwil/matches/qm3': matchInfo,
    '/events/2018orwil/matches/qm3/reports/frc254': null,
    '/events/2018orwil/matches/qm3/comments/frc254': null,
  })
  const scoutPage = render(<ScoutPage eventKey="2018orwil" matchKey="qm3" />)

  expect(scoutPage.getByText(/submit/i)).toBeDisabled()

  await scoutPage.findByText('Scale Cubes')

  expect(scoutPage.getByText(/submit/i)).toBeDisabled()

  fireEvent.click(scoutPage.getByLabelText('254'))

  expect(scoutPage.getByText(/submit/i)).not.toBeDisabled()

  const scaleCubesDiv = scoutPage.getByText(/scale cubes/i)
    .parentElement as HTMLDivElement
  const [successesInput, failuresInput] = (scaleCubesDiv.querySelectorAll(
    'input',
  ) as unknown) as HTMLInputElement[]
  fireEvent.change(successesInput, { target: { valueAsNumber: 3 } })
  fireEvent.change(failuresInput, { target: { valueAsNumber: 2 } })

  const crossedLineDiv = scoutPage.getByText(/crossed line/i)
    .parentElement as HTMLDivElement
  const attemptedBox = crossedLineDiv.querySelector(
    'input[value=Attempted]',
  ) as HTMLInputElement
  fireEvent.change(attemptedBox, { target: { checked: true } })

  expect(scoutPage.getByText(/submit/i)).not.toBeDisabled()

  fireEvent.click(scoutPage.getByText(/submit/i))

  await wait(() =>
    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringMatching(
        /\/events\/2018orwil\/matches\/qm3\/reports\/frc254$/,
      ),
      {
        body: JSON.stringify(report),
        headers: {},
        method: 'PUT',
      },
    ),
  )
})
