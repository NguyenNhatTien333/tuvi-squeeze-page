import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OptInForm } from '@/components/shared/OptInForm'

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Control extractUTMSource return value per test
const mockExtractUTMSource = jest.fn(() => 'direct')
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  extractUTMSource: (...args: any[]) => mockExtractUTMSource(...args),
}))

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('OptInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it('renders the form with name and email fields', () => {
    render(<OptInForm />)

    expect(screen.getByLabelText(/họ và tên/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /nhận cẩm nang ngay/i })).toBeInTheDocument()
  })

  it('shows validation error when full_name is too short', async () => {
    render(<OptInForm />)

    await userEvent.type(screen.getByLabelText(/họ và tên/i), 'A')
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    fireEvent.submit(screen.getByRole('button', { name: /nhận cẩm nang ngay/i }))

    await waitFor(() => {
      expect(screen.getByText(/ít nhất 2 ký tự/i)).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    render(<OptInForm />)

    await userEvent.type(screen.getByLabelText(/họ và tên/i), 'Nguyễn Văn A')
    await userEvent.type(screen.getByLabelText(/email/i), 'not-an-email')
    fireEvent.submit(screen.getByRole('button', { name: /nhận cẩm nang ngay/i }))

    await waitFor(() => {
      expect(screen.getByText(/email không hợp lệ/i)).toBeInTheDocument()
    })
  })

  it('submits the form and redirects to /thank-you on success', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<OptInForm />)

    await userEvent.type(screen.getByLabelText(/họ và tên/i), 'Nguyễn Văn A')
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.click(screen.getByRole('button', { name: /nhận cẩm nang ngay/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/subscribe',
        expect.objectContaining({ method: 'POST' })
      )
      expect(mockPush).toHaveBeenCalledWith('/thank-you')
    })
  })

  it('sends utm_source in the request body', async () => {
    mockExtractUTMSource.mockReturnValueOnce('facebook')
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<OptInForm />)

    await userEvent.type(screen.getByLabelText(/họ và tên/i), 'Nguyễn Văn A')
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.click(screen.getByRole('button', { name: /nhận cẩm nang ngay/i }))

    await waitFor(() => {
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
      const body = JSON.parse(fetchCall[1].body)
      expect(body.utm_source).toBe('facebook')
    })
  })

  it('shows a loading spinner while submitting', async () => {
    let resolvePromise!: (value: unknown) => void
    ;(global.fetch as jest.Mock).mockReturnValueOnce(
      new Promise((resolve) => { resolvePromise = resolve })
    )

    render(<OptInForm />)

    await userEvent.type(screen.getByLabelText(/họ và tên/i), 'Nguyễn Văn A')
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.click(screen.getByRole('button', { name: /nhận cẩm nang ngay/i }))

    await waitFor(() => {
      expect(screen.getByText(/đang xử lý/i)).toBeInTheDocument()
    })

    // Clean up pending promise
    resolvePromise({ ok: true, json: async () => ({ success: true }) })
  })

  it('shows alert on API error response', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Có lỗi xảy ra' }),
    })

    render(<OptInForm />)

    await userEvent.type(screen.getByLabelText(/họ và tên/i), 'Nguyễn Văn A')
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.click(screen.getByRole('button', { name: /nhận cẩm nang ngay/i }))

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Có lỗi xảy ra')
    })

    alertMock.mockRestore()
  })

  it('disables fields and button while submitting', async () => {
    let resolvePromise!: (value: unknown) => void
    ;(global.fetch as jest.Mock).mockReturnValueOnce(
      new Promise((resolve) => { resolvePromise = resolve })
    )

    render(<OptInForm />)

    await userEvent.type(screen.getByLabelText(/họ và tên/i), 'Nguyễn Văn A')
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.click(screen.getByRole('button', { name: /nhận cẩm nang ngay/i }))

    await waitFor(() => {
      expect(screen.getByLabelText(/họ và tên/i)).toBeDisabled()
      expect(screen.getByLabelText(/email/i)).toBeDisabled()
    })

    resolvePromise({ ok: true, json: async () => ({ success: true }) })
  })
})
