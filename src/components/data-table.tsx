import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface ColumnDef<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  cell?: (value: unknown, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  emptyMessage?: string
}

export function DataTable<T>({
  data,
  columns,
  emptyMessage = 'No data available',
}: DataTableProps<T>): JSX.Element {
  const getCellValue = (
    row: T,
    accessor: keyof T | ((row: T) => React.ReactNode),
  ): React.ReactNode => {
    if (typeof accessor === 'function') {
      return accessor(row)
    }
    return row[accessor] as React.ReactNode
  }

  const renderCell = (row: T, column: ColumnDef<T>): React.ReactNode => {
    const value = getCellValue(row, column.accessor)

    if (column.cell) {
      return column.cell(value, row)
    }

    return value ?? null
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>{renderCell(row, column)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
