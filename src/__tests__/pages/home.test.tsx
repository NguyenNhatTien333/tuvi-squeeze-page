import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@/components/shared/ParticlesBg', () => ({
  ParticlesBg: () => <div data-testid="particles-bg" />,
}))

jest.mock('@/components/shared/OptInForm', () => ({
  OptInForm: () => <div data-testid="opt-in-form" />,
}))

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Home page (/)', () => {
  it('renders without crashing', () => {
    const { container } = render(<Home />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders the ParticlesBg component', () => {
    render(<Home />)
    expect(screen.getByTestId('particles-bg')).toBeInTheDocument()
  })

  it('renders the OptInForm component', () => {
    render(<Home />)
    expect(screen.getByTestId('opt-in-form')).toBeInTheDocument()
  })

  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('contains "Vận Mệnh" text in the heading', () => {
    render(<Home />)
    expect(screen.getAllByText(/vận mệnh/i).length).toBeGreaterThan(0)
  })

  it('shows social-proof text about number of students', () => {
    render(<Home />)
    expect(screen.getByText(/10,000\+/i)).toBeInTheDocument()
  })

  it('shows brand name "Nghiên cứu Tử Vi"', () => {
    render(<Home />)
    expect(screen.getAllByText(/nghiên cứu tử vi/i).length).toBeGreaterThan(0)
  })
})
