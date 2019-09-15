import { render, fireEvent } from '@calebeby/preact-testing-library'
import { h } from 'preact'
import { ProcessedMatchInfo } from '@/api/match-info'
import { Schema } from '@/api/schema'
import { Report } from '@/api/report'
import { ReportEditor } from '.'
import { submitReport } from '@/api/report/submit-report'

const matchInfo: ProcessedMatchInfo = {
  key: 'qm3',
  redAlliance: ['frc254', 'frc2471', 'frc973'],
  blueAlliance: ['frc971', 'frc2733', 'frc118'],
  time: new Date('2018-12-22'),
}

const schema: Schema = {
  id: 1000,
  schema: [
    {
      name: 'Crossed Line',
      type: 'boolean',
      period: 'auto',
      reportReference: 'Crossed Line',
    },
    {
      name: 'Switch Cubes',
      type: 'number',
      period: 'auto',
      reportReference: 'Switch Cubes',
    },
    {
      name: 'Scale Cubes',
      type: 'number',
      period: 'teleop',
      reportReference: 'Scale Cubes',
    },
    {
      name: 'Climbed',
      type: 'boolean',
      period: 'teleop',
      reportReference: 'Climbed',
    },
  ],
}

jest.mock('@/api/report/submit-report', () => ({
  submitReport: jest.fn(),
}))

test('renders and saves', async () => {
  const initialReport: Report = {
    data: [
      { name: 'Scale Cubes', value: 2 },
      { name: 'Climbed', value: 0 },
      { name: 'Crossed Line', value: 1 },
      { name: 'Switch Cubes', value: 1 },
    ],
  }
  const expectedFinalReport: Report = {
    data: [
      { name: 'Scale Cubes', value: 3 },
      { name: 'Climbed', value: 0 },
      { name: 'Crossed Line', value: 0 },
      { name: 'Switch Cubes', value: 0 },
    ],
  }

  const reportEditor = render(
    <ReportEditor
      eventKey="2018orwil"
      matchKey="qm3"
      schema={schema}
      match={matchInfo}
      initialReport={initialReport}
    />,
  )

  expect(reportEditor.getByText(/save/i)).toBeDisabled()

  await reportEditor.findByText('Scale Cubes')

  expect(reportEditor.getByText(/save/i)).toBeDisabled()
  fireEvent.click(reportEditor.getByLabelText('254'))
  expect(reportEditor.getByText(/save/i)).not.toBeDisabled()

  expect(reportEditor.getByLabelText(/Crossed Line/)).toBeChecked()
  fireEvent.change(reportEditor.getByLabelText(/Crossed Line/), {
    target: { checked: false },
  })

  expect(reportEditor.getByLabelText(/Climbed/)).not.toBeChecked()

  expect(reportEditor.getByLabelText(/Scale Cubes/)).toHaveValue(2)
  fireEvent.change(reportEditor.getByLabelText(/Scale Cubes/), {
    target: { valueAsNumber: 3 },
  })

  expect(reportEditor.getByLabelText(/Switch Cubes/)).toHaveValue(1)
  fireEvent.change(reportEditor.getByLabelText(/Switch Cubes/), {
    target: { valueAsNumber: 0 },
  })

  fireEvent.click(reportEditor.getByText(/save/i))

  expect(submitReport).toHaveBeenCalledWith('2018orwil', 'qm3', 'frc254', {
    data: expect.arrayContaining(expectedFinalReport.data),
  })
  expect(submitReport).toHaveBeenCalledTimes(1)
})
