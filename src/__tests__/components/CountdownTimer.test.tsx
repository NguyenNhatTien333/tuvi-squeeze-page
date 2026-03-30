import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { CountdownTimer } from '@/components/shared/CountdownTimer'

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('lucide-react', () => ({
  Clock: () => <svg data-testid="clock-icon" />,
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
    <span data-testid="badge" data-variant={variant}>
      {children}
    </span>
  ),
}))

const STORAGE_KEY = 'tuvi_countdown_expiry'

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CountdownTimer', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    localStorage.clear()
  })

  it('renders the countdown display after mount', async () => {
    render(<CountdownTimer />)

    // Trigger the first interval tick so timeLeft is populated
    await act(async () => {
      jest.advanceTimersByTime(0)
    })

    expect(screen.getByTestId('clock-icon')).toBeInTheDocument()
    expect(screen.getByText(/còn lại/i)).toBeInTheDocument()
  })

  it('shows formatted time digits (MM:SS) after mount', async () => {
    render(<CountdownTimer />)

    await act(async () => {
      jest.advanceTimersByTime(0)
    })

    const timeText = screen.getByText(/\d{2}:\d{2}/)
    expect(timeText).toBeInTheDocument()
  })

  it('persists expiry time in localStorage', async () => {
    render(<CountdownTimer />)

    await act(async () => {
      jest.advanceTimersByTime(0)
    })

    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('reuses existing expiry from localStorage instead of creating a new one', async () => {
    // Pre-set an expiry 5 minutes from now
    const fiveMinutes = Date.now() + 5 * 60 * 1000
    localStorage.setItem(STORAGE_KEY, fiveMinutes.toString())

    render(<CountdownTimer />)

    await act(async () => {
      jest.advanceTimersByTime(0)
    })

    // The stored value should remain the same (not overwritten)
    expect(localStorage.getItem(STORAGE_KEY)).toBe(fiveMinutes.toString())
  })

  it('shows expired badge when expiry is in the past', async () => {
    // Set an expiry time in the past
    localStorage.setItem(STORAGE_KEY, '0')

    render(<CountdownTimer />)

    await act(async () => {
      jest.advanceTimersByTime(0)
    })

    const badge = screen.getByTestId('badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute('data-variant', 'destructive')
    expect(badge.textContent).toContain('Chương trình "Hữu duyên" ưu đãi 199k đã kết thúc, hẹn bạn ở lần tới!')
  })

  it('decrements the timer by 1 second each interval tick', async () => {
    render(<CountdownTimer />)

    await act(async () => {
      jest.advanceTimersByTime(0)
    })

    const before = screen.getByText(/\d{2}:\d{2}/).textContent

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    const after = screen.getByText(/\d{2}:\d{2}/).textContent

    // The displayed time should have changed
    expect(before).not.toBe(after)
  })
})
