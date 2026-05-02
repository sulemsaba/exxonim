import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from './Navigation'

const mockProps = {
  brand: {
    name: 'Exxonim',
    lightLogoSrc: '/logo-light.svg',
    darkLogoSrc: '/logo-dark.svg',
  },
  company: {
    name: 'Exxonim',
    phones: ['+1 234 567 890'],
    emails: ['test@example.com'],
    address: 'Test Address',
    whatsapp: '+1 234 567 890',
  },
  navigationItems: [
    { id: '1', label: 'Home', href: '/', title: 'Home', url: '/', kind: 'page', children: [], is_visible: true },
    { id: '2', label: 'Services', href: '/services', title: 'Services', url: '/services', kind: 'category', is_visible: true, children: [{ id: '2-1', label: 'Registration', href: '/services/registration', title: 'Registration', url: '/services/registration', kind: 'page', children: [], is_visible: true }] },
    { id: '3', label: 'Resources', href: '/resources', title: 'Resources', url: '/resources', kind: 'category', is_visible: true, children: [] },
    { id: '4', label: 'About', href: '/about', title: 'About', url: '/about', kind: 'page', is_visible: true, children: [] },
  ] as any,
  pathname: '/',
  theme: 'light' as const,
  onToggleTheme: vi.fn(),
}

describe('Navigation', () => {
  it('renders brand logo', () => {
    render(<Navigation {...mockProps} />)
    expect(screen.getByAltText('Exxonim')).toBeInTheDocument()
  })

  it('renders primary navigation links', () => {
    render(<Navigation {...mockProps} />)
    const links = screen.getAllByRole('link')
    const linkTexts = links.map(l => l.textContent)
    expect(linkTexts.some(t => /services/i.test(t || ''))).toBe(true)
    expect(linkTexts.some(t => /resources/i.test(t || ''))).toBe(true)
  })

  it('toggles mobile menu', async () => {
    render(<Navigation {...mockProps} />)
    const menuButton = screen.getByLabelText(/open navigation/i)
    await userEvent.click(menuButton)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes mobile menu on backdrop click', async () => {
    render(<Navigation {...mockProps} />)
    const menuButton = screen.getByLabelText(/open navigation/i)
    await userEvent.click(menuButton)
    // Menu is open
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    // Find backdrop (the first close button)
    const backdrop = screen.getAllByLabelText(/close navigation/i)[0]
    await userEvent.click(backdrop)
    // Menu button should show "Open" again
    expect(screen.getByLabelText(/open navigation/i)).toBeInTheDocument()
  })

  it('toggles theme', async () => {
    const onToggleTheme = vi.fn()
    render(<Navigation {...mockProps} onToggleTheme={onToggleTheme} />)
    const themeButtons = screen.getAllByLabelText(/toggle theme/i)
    await userEvent.click(themeButtons[0])
    expect(onToggleTheme).toHaveBeenCalledTimes(1)
  })

  it('shows call button', () => {
    render(<Navigation {...mockProps} />)
    expect(screen.getAllByText(/call now/i).length).toBeGreaterThanOrEqual(1)
  })
})
