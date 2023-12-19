import { RenderableProps } from 'preact'
import { useState } from 'preact/hooks'
import { css } from 'linaria'
import { lightGrey, faintGrey, pigmicePurple } from '@/colors'
import clsx from 'clsx'
import { BooleanDisplay } from './boolean-display'

const borderBottomAndRight = `box-shadow: inset -1px -1px ${lightGrey}`
// the 2nd shadow covers a tiny gap between the cells I couldn't otherwise remove
export const borderRightOnly = `box-shadow: inset -1px 0 ${lightGrey}, 0 1px 0 white`
const borderBottomOnly = `box-shadow: inset 0 -1px ${lightGrey}`
const activeBorderBottomOnly = `box-shadow: inset 0 -0.15rem ${pigmicePurple}`

const tableStyle = css`
  border-collapse: collapse;
  table-layout: fixed;
`

const tableHeaderRowStyle = css``
export const contextRowHeight = '1.5rem'
const contextRowStyle = css`
  height: ${contextRowHeight};

  & th {
    position: sticky;
    top: 0;
  }
`

const activeStyle = css``

const tableHeaderCellStyle = css`
  position: sticky;
  white-space: nowrap;
  padding: 0;
  top: 0;
  background: white;
  ${borderBottomOnly};

  &.${activeStyle}:not(:first-child) {
    ${activeBorderBottomOnly}
  }

  &.${activeStyle}:not(:first-child),
  &:focus-within,
  &:hover {
    background: ${faintGrey};
  }

  &:first-child {
    left: 0;
    z-index: 1;
    ${borderBottomAndRight};
  }
`

const tableHeaderCellWithContextStyle = css`
  top: ${contextRowHeight};
`

const sortButtonStyle = css`
  width: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.6rem 0.4rem;
  font-size: 0.78rem;
  outline: none;
`

export interface Column<CellType, RowType> {
  /** Column name, used in title row */
  title: string
  key: string
  renderCell: (
    cellValue: CellType,
    row: RowType,
    rowIndex: number,
    sortColKey: string,
  ) => JSX.Element
  /** Function to retrieve the cell value, used for sorting */
  getCellValue: (cellValue: CellType) => number | string | boolean
  getCell: (row: RowType) => CellType
  /** Column's intrinsic default sort order. For different columns different values make sense */
  sortOrder: SortOrder
}

const cellStyle = css`
  text-align: center;
  max-width: 6.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const createTextColumn = <RowType extends any = never>(
  title: string,
  getValue: (row: RowType) => string,
  additionalOpts: Partial<Column<string, RowType>> = {},
): Column<string, RowType> => ({
  renderCell: (value) => (
    <td class={cellStyle} title={value}>
      {value}
    </td>
  ),
  title,
  key: title,
  getCellValue: (value) => value.toLowerCase(),
  sortOrder: SortOrder.ASC,
  getCell: getValue,
  ...additionalOpts,
})

export const createNumberColumn = <RowType extends any = never>(
  title: string,
  getValue: (row: RowType) => number,
  additionalOpts: Partial<Column<number, RowType>> = {},
): Column<number, RowType> => ({
  renderCell: (value) => <td class={cellStyle}>{value}</td>,
  title,
  key: title,
  getCellValue: (value) => value,
  sortOrder: SortOrder.DESC,
  getCell: getValue,
  ...additionalOpts,
})

export const createBooleanColumn = <RowType extends any = never>(
  title: string,
  getValue: (row: RowType) => boolean,
  additionalOpts: Partial<Column<boolean, RowType>> = {},
): Column<boolean, RowType> => ({
  renderCell: (value) => (
    <td class={cellStyle}>
      <BooleanDisplay value={value} />
    </td>
  ),
  title,
  key: title,
  getCellValue: (value) => value,
  sortOrder: SortOrder.DESC,
  getCell: getValue,
  ...additionalOpts,
})

export const enum SortOrder {
  /** Low to high */
  ASC = 1,
  /** High to low */
  DESC,
}

const enum SortOrderState {
  DEFAULT = 1,
  REVERSED,
}

export interface Row<RowType> {
  key: string | number
  value: RowType
}

interface Props<RowType> {
  columns: Column<any, RowType>[]
  rows: Row<RowType>[]
  defaultSortColumn?: Column<any, RowType>
  contextRow?: JSX.Element
}

export const Table = <RowType extends any>({
  rows,
  columns,
  defaultSortColumn: defaultSortCol = columns[0],
  contextRow,
}: RenderableProps<Props<RowType>>) => {
  const [sortColKey, setSortColKey] = useState<string>(defaultSortCol.key)
  const sortCol =
    columns.find((col) => col.key === sortColKey) || defaultSortCol
  const [sortOrder, setSortOrder] = useState<SortOrderState>(
    SortOrderState.DEFAULT,
  )

  const updateSortCol = (col: Column<any, RowType>) => {
    setSortOrder(
      col.key === sortColKey
        ? // if the column is already selected, reverse the order
          sortOrder === SortOrderState.DEFAULT
          ? SortOrderState.REVERSED
          : SortOrderState.DEFAULT
        : // otherwise use the default order
          SortOrderState.DEFAULT,
    )
    setSortColKey(col.key)
  }

  const compareRows = (
    a: Row<RowType>,
    b: Row<RowType>,
    col = sortCol,
  ): number => {
    const aVal = col.getCellValue(col.getCell(a.value))
    const bVal = col.getCellValue(col.getCell(b.value))
    const sortOrderStateMultiplier =
      sortOrder === SortOrderState.REVERSED ? -1 : 1
    const columnSortMultiplier = col.sortOrder === SortOrder.ASC ? -1 : 1
    const result =
      (aVal > bVal ? -1 : bVal > aVal ? 1 : 0) *
      sortOrderStateMultiplier *
      columnSortMultiplier
    if (result === 0 && col !== defaultSortCol) {
      return compareRows(a, b, defaultSortCol)
    }
    return result
  }
  return (
    <table class={tableStyle}>
      <thead>
        {contextRow && <tr class={contextRowStyle}>{contextRow}</tr>}
        <tr class={tableHeaderRowStyle}>
          {columns.map((col) => (
            <th
              key={col.key}
              class={clsx(
                tableHeaderCellStyle,
                col === sortCol && activeStyle,
                contextRow && tableHeaderCellWithContextStyle,
              )}
              scope="col"
            >
              <button
                class={sortButtonStyle}
                onClick={() => updateSortCol(col)}
              >
                {col.title}
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.sort(compareRows).map((row, index) => (
          <TableRow
            key={row.key}
            row={row}
            columns={columns}
            index={index}
            sortColKey={sortColKey}
          />
        ))}
      </tbody>
    </table>
  )
}

const tableRowStyle = css`
  ${borderBottomOnly};
  background: white;

  &:hover {
    background: ${faintGrey};
  }

  & td,
  & th {
    font-size: 1rem;
    font-weight: normal;
  }

  & td {
    padding: 0.8rem 0.6rem;
    ${borderBottomOnly};
  }

  & th:last-of-type {
    position: sticky;
    left: 0;
    background: inherit;
    ${borderBottomAndRight}
  }
`

const TableRow = <RowType extends any>({
  row,
  columns,
  index,
  sortColKey,
}: RenderableProps<{
  row: Row<RowType>
  columns: Column<any, RowType>[]
  index: number
  sortColKey: string
}>) => (
  <tr class={tableRowStyle}>
    {columns.map((col) => {
      const cell = col.getCell(row.value)
      return col.renderCell(cell, row.value, index, sortColKey)
    })}
  </tr>
)
