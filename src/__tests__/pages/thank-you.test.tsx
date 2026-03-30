import React from 'react'
import { render, screen } from '@testing-library/react'
import ThankYouPage from '@/app/thank-you/page'

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/components/shared/ParticlesBg', () => ({
  ParticlesBg: () => <div data-testid="particles-bg" />,
}))

jest.mock('@/components/shared/CountdownTimer', () => ({
  CountdownTimer: () => <div data-testid="countdown-timer" />,
}))

// Badge renders as <div> causing invalid <p><div> nesting in React 19 — use a <span> stub
jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>{children}</span>
  ),
}))

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Thank You page (/thank-you)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_PDF_DOWNLOAD_URL = 'https://example.com/pdf'
    process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID = '9AC2Z2Ik8_Q'
  })

  it('renders without crashing', () => {
    const { container } = render(<ThankYouPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the ParticlesBg component', () => {
    render(<ThankYouPage />)
    expect(screen.getByTestId('particles-bg')).toBeInTheDocument()
  })

  it('renders the CountdownTimer component', () => {
    render(<ThankYouPage />)
    expect(screen.getByTestId('countdown-timer')).toBeInTheDocument()
  })

  it('shows a "Cảm Ơn" heading', () => {
    render(<ThankYouPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/cảm ơn/i)
  })

  it('renders an email-check instruction', () => {
    render(<ThankYouPage />)
    expect(screen.getByText(/kiểm tra hộp thư email/i)).toBeInTheDocument()
  })

  it('renders a PDF download button when NEXT_PUBLIC_PDF_DOWNLOAD_URL is set', () => {
    render(<ThankYouPage />)
    const downloadLink = screen.getByRole('link', { name: /tải cẩm nang/i })
    expect(downloadLink).toBeInTheDocument()
    expect(downloadLink).toHaveAttribute('href', 'https://example.com/pdf')
  })

  it('opens the PDF link in a new tab', () => {
    render(<ThankYouPage />)
    const downloadLink = screen.getByRole('link', { name: /tải cẩm nang/i })
    expect(downloadLink).toHaveAttribute('target', '_blank')
    expect(downloadLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('does not render PDF download button when URL is not set', () => {
    process.env.NEXT_PUBLIC_PDF_DOWNLOAD_URL = ''
    render(<ThankYouPage />)
    expect(screen.queryByRole('link', { name: /tải cẩm nang/i })).not.toBeInTheDocument()
  })

  it('renders a YouTube embed when video ID is set', () => {
    render(<ThankYouPage />)
    const iframe = screen.getByTitle(/nghiên cứu tử vi video/i)
    expect(iframe).toBeInTheDocument()
    expect(iframe.getAttribute('src')).toContain('9AC2Z2Ik8_Q')
  })
})
