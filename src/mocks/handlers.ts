import { HttpResponse, http } from 'msw'

export const handlers = [
  // Intercept the "GET /message" request with new error envelope format
  http.get('/api/message', () =>
    HttpResponse.json({
      success: true,
      data: { message: 'Hello from the handler!' },
    }),
  ),
]
