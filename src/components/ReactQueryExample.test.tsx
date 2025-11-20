import { render as rtlRender, screen } from '@testing-library/react'
import ReactQueryExample from './ReactQueryExample'
import { server } from '@/mocks/server'
import { HttpResponse, http } from 'msw'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@/test/test-utils'
import { ReactElement } from 'react'

describe('<ReactQueryExample/>', () => {
  it('Renders the loading screen', () => {
    render(<ReactQueryExample />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('Renders data from the handler', async () => {
    render(<ReactQueryExample />)

    await screen.findByText('Hello from the handler!')
  })

  it('Renders data from overridden handler', async () => {
    server.use(
      http.get('/api/message', () =>
        HttpResponse.json({
          success: true,
          data: { message: 'Hello from the overridden handler!' },
        }),
      ),
    )

    render(<ReactQueryExample />)

    await screen.findByText('Hello from the overridden handler!')
  })

  it('Renders error state when API fails', async () => {
    // Create a QueryClient with no retries for faster error testing
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    })

    server.use(
      http.get('/api/message', () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              message: 'Failed to fetch',
              code: 'INTERNAL_ERROR',
            },
          },
          { status: 500 },
        ),
      ),
    )

    rtlRender(
      <QueryClientProvider client={queryClient}>
        <ReactQueryExample />
      </QueryClientProvider>,
    )

    await screen.findByText(/Failed to load message/i)
  })
})
