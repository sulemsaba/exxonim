import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProviderSection } from './ProviderSection'

const mockContent = {
  kicker: 'Trusted By',
  title: 'Industry Leaders',
  logos: [
    { src: '/logo1.svg', alt: 'Company 1' },
    { src: '/logo2.svg', alt: 'Company 2' },
  ],
}

describe('ProviderSection', () => {
  it('renders kicker and title', () => {
    render(<ProviderSection content={mockContent} />)
    expect(screen.getByText('Trusted By')).toBeInTheDocument()
    expect(screen.getByText('Industry Leaders')).toBeInTheDocument()
  })

  it('renders all logos twice for marquee', () => {
    render(<ProviderSection content={mockContent} />)
    const logos = screen.getAllByAltText(/logo$/i)
    expect(logos).toHaveLength(4)
  })

  it('has accessible aria label', () => {
    render(<ProviderSection content={mockContent} />)
    expect(screen.getByLabelText(/client and partner logos/i)).toBeInTheDocument()
  })
})
