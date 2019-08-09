import { h, JSX, RenderableProps } from 'preact'
import { useState } from 'preact/hooks'
import { memo } from '@/utils/memo'
import { css } from 'linaria'
import { lightGrey, faintGrey, pigmicePurple } from '@/colors'
import clsx from 'clsx'

const borderBottomAndRight = `box-shadow: inset -1px -1px ${lightGrey}`
// the 2nd shadow covers a tiny gap between the cells I couldn't otherwise remove
export const borderRightOnly = `box-shadow: inset -1px 0 ${lightGrey}, 0 1px 0 white`
const borderBottomOnly = `box-shadow: inset 0 -1px ${lightGrey}`
const activeBorderBottomOnly = `box-shadow: inset 0 -2px ${pigmicePurple}`

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
  padding: 0.7rem 0.4rem;
  font-size: 0.78rem;
  outline: none;
`

export interface Column<CellType, RowType> {
  /** Column name, used in title row */
  title: string
  renderCell: (cellValue: CellType) => JSX.Element
  /** Function to retrieve the cell value, used for sorting */
  getCellValue: (cellValue: CellType) => number | string
  getCell: (row: RowType) => CellType
  /** Sort order, defaults to descending (high to low) */
  sortOrder?: SortOrder
}

export const enum SortOrder {
  /** Low to high */
  ASC = 1,
  /** High to low */
  DESC,
}

const defaultSortOrder = SortOrder.DESC

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
  defaultSortColumn = columns[0],
  contextRow,
}: RenderableProps<Props<RowType>>) => {
  const [sortColTitle, setSortColTitle] = useState<string>(
    defaultSortColumn.title,
  )
  const sortCol =
    columns.find(col => col.title === sortColTitle) || defaultSortColumn
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    defaultSortColumn.sortOrder || defaultSortOrder,
  )

  const updateSortCol = (col: Column<any, RowType>) => {
    setSortOrder(
      col.title === sortColTitle
        ? // if the column is already selected, reverse the order
          sortOrder === SortOrder.ASC
          ? SortOrder.DESC
          : SortOrder.ASC
        : // otherwise use that column's sort order or the default
          col.sortOrder || defaultSortOrder,
    )
    setSortColTitle(col.title)
  }

  const compareRows = (a: Row<RowType>, b: Row<RowType>): number => {
    const aVal = sortCol.getCellValue(sortCol.getCell(a.value))
    const bVal = sortCol.getCellValue(sortCol.getCell(b.value))
    const multiplier = sortOrder === SortOrder.ASC ? -1 : 1
    return (aVal > bVal ? -1 : bVal > aVal ? 1 : 0) * multiplier
  }

  return (
    <table class={tableStyle}>
      <thead>
        {contextRow && <tr class={contextRowStyle}>{contextRow}</tr>}
        <tr class={tableHeaderRowStyle}>
          {columns.map(col => (
            <th
              key={col.title}
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
        {rows.sort(compareRows).map(row => (
          <TableRow key={row.key} row={row} columns={columns} />
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
  }

  & th:last-of-type {
    position: sticky;
    left: 0;
    background: inherit;
    ${borderBottomAndRight}
  }
`

const TableRow = memo(
  <RowType extends any>({
    row,
    columns,
  }: RenderableProps<{
    row: Row<RowType>
    columns: Column<any, RowType>[]
  }>) => (
    <tr class={tableRowStyle}>
      {columns.map(col => {
        const cell = col.getCell(row.value)
        return col.renderCell(cell)
      })}
    </tr>
  ),
)
