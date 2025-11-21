import { render, screen } from '@/test/test-utils'
import { DataTable, type ColumnDef } from './data-table'

// Test data types
interface User {
  id: string
  email: string
  name: string | null
  created_at: string
}

interface Post {
  id: string
  title: string
  published: boolean
}

describe('DataTable', () => {
  describe('Happy Path', () => {
    it('should render table with data using keyof accessor', () => {
      const columns: ColumnDef<User>[] = [
        { header: 'Email', accessor: 'email' },
        { header: 'Name', accessor: 'name' },
      ]

      const data: User[] = [
        {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          created_at: '2024-01-01',
        },
        {
          id: '2',
          email: 'user@example.com',
          name: 'User Name',
          created_at: '2024-01-02',
        },
      ]

      render(<DataTable data={data} columns={columns} />)

      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('user@example.com')).toBeInTheDocument()
      expect(screen.getByText('User Name')).toBeInTheDocument()
    })

    it('should render table with data using function accessor', () => {
      const columns: ColumnDef<User>[] = [
        {
          header: 'Full Info',
          accessor: (row) => `${row.name} (${row.email})`,
        },
      ]

      const data: User[] = [
        {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          created_at: '2024-01-01',
        },
      ]

      render(<DataTable data={data} columns={columns} />)

      expect(
        screen.getByText('Test User (test@example.com)'),
      ).toBeInTheDocument()
    })

    it('should render table with custom cell renderer', () => {
      const columns: ColumnDef<Post>[] = [
        {
          header: 'Title',
          accessor: 'title',
          cell: (value) => <strong>{value as string}</strong>,
        },
        {
          header: 'Status',
          accessor: 'published',
          cell: (value) => (value ? 'Published' : 'Draft'),
        },
      ]

      const data: Post[] = [{ id: '1', title: 'My Post', published: true }]

      render(<DataTable data={data} columns={columns} />)

      const strongElement = screen.getByText('My Post').closest('strong')
      expect(strongElement).toBeInTheDocument()
      expect(screen.getByText('Published')).toBeInTheDocument()
    })

    it('should render table with different data types', () => {
      const postColumns: ColumnDef<Post>[] = [
        { header: 'Title', accessor: 'title' },
        { header: 'Published', accessor: 'published' },
      ]

      const postData: Post[] = [
        { id: '1', title: 'Post 1', published: true },
        { id: '2', title: 'Post 2', published: false },
      ]

      render(<DataTable data={postData} columns={postColumns} />)

      expect(screen.getByText('Post 1')).toBeInTheDocument()
      expect(screen.getByText('Post 2')).toBeInTheDocument()
    })
  })

  describe('Invalid Input', () => {
    it('should handle null values in data', () => {
      const columns: ColumnDef<User>[] = [
        { header: 'Email', accessor: 'email' },
        { header: 'Name', accessor: 'name' },
      ]

      const data: User[] = [
        {
          id: '1',
          email: 'test@example.com',
          name: null,
          created_at: '2024-01-01',
        },
      ]

      render(<DataTable data={data} columns={columns} />)

      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      // null values should render as empty or null
      const cells = screen.getAllByRole('cell')
      expect(cells.some((cell) => cell.textContent === '')).toBe(true)
    })

    it('should handle empty array', () => {
      const columns: ColumnDef<User>[] = [
        { header: 'Email', accessor: 'email' },
      ]

      render(<DataTable data={[]} columns={columns} />)

      expect(screen.queryByRole('table')).not.toBeInTheDocument()
      expect(screen.getByText('No data available')).toBeInTheDocument()
    })

    it('should display custom empty message', () => {
      const columns: ColumnDef<User>[] = [
        { header: 'Email', accessor: 'email' },
      ]

      render(
        <DataTable
          data={[]}
          columns={columns}
          emptyMessage="No users found."
        />,
      )

      expect(screen.getByText('No users found.')).toBeInTheDocument()
    })
  })

  describe('Boundary Cases', () => {
    it('should handle undefined values gracefully', () => {
      const columns: ColumnDef<User>[] = [
        { header: 'Email', accessor: 'email' },
        { header: 'Name', accessor: 'name' },
      ]

      const data: User[] = [
        {
          id: '1',
          email: 'test@example.com',
          name: undefined as unknown as string | null,
          created_at: '2024-01-01',
        },
      ]

      render(<DataTable data={data} columns={columns} />)

      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should handle large datasets', () => {
      const columns: ColumnDef<User>[] = [
        { header: 'Email', accessor: 'email' },
      ]

      const data: User[] = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        email: `user${i}@example.com`,
        name: `User ${i}`,
        created_at: '2024-01-01',
      }))

      render(<DataTable data={data} columns={columns} />)

      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getAllByRole('row')).toHaveLength(101) // 1 header + 100 rows
    })

    it('should handle empty string values', () => {
      const columns: ColumnDef<User>[] = [
        { header: 'Email', accessor: 'email' },
        { header: 'Name', accessor: 'name' },
      ]

      const data: User[] = [
        { id: '1', email: '', name: '', created_at: '2024-01-01' },
      ]

      render(<DataTable data={data} columns={columns} />)

      expect(screen.getByRole('table')).toBeInTheDocument()
      const cells = screen.getAllByRole('cell')
      expect(cells.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have proper table structure with semantic HTML', () => {
      const columns: ColumnDef<User>[] = [
        { header: 'Email', accessor: 'email' },
      ]

      const data: User[] = [
        {
          id: '1',
          email: 'test@example.com',
          name: 'Test',
          created_at: '2024-01-01',
        },
      ]

      render(<DataTable data={data} columns={columns} />)

      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()

      const header = table.querySelector('thead')
      expect(header).toBeInTheDocument()

      const body = table.querySelector('tbody')
      expect(body).toBeInTheDocument()
    })

    it('should have proper table headers', () => {
      const columns: ColumnDef<User>[] = [
        { header: 'Email', accessor: 'email' },
        { header: 'Name', accessor: 'name' },
      ]

      const data: User[] = [
        {
          id: '1',
          email: 'test@example.com',
          name: 'Test',
          created_at: '2024-01-01',
        },
      ]

      render(<DataTable data={data} columns={columns} />)

      const headers = screen.getAllByRole('columnheader')
      expect(headers).toHaveLength(2)
      expect(headers[0]).toHaveTextContent('Email')
      expect(headers[1]).toHaveTextContent('Name')
    })
  })
})
