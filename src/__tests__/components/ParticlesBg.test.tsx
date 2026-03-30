import React from 'react'
import { render, screen } from '@testing-library/react'
import { ParticlesBg } from '@/components/shared/ParticlesBg'

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}))

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ParticlesBg', () => {
  it('renders without crashing', () => {
    const { container } = render(<ParticlesBg />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders exactly 25 particle elements', () => {
    const { container } = render(<ParticlesBg />)
    // The wrapper div + 25 particle divs
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.children).toHaveLength(25)
  })

  it('renders a fixed, pointer-events-none container', () => {
    const { container } = render(<ParticlesBg />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toMatch(/fixed/)
    expect(wrapper.className).toMatch(/pointer-events-none/)
  })

  it('renders particles with rounded-full style', () => {
    const { container } = render(<ParticlesBg />)
    const wrapper = container.firstChild as HTMLElement
    const firstParticle = wrapper.children[0] as HTMLElement
    expect(firstParticle.className).toMatch(/rounded-full/)
  })
})
