import { describe, it, expect } from 'vitest';
import { render } from 'src/__tests__/test-utils';
import { DashboardLayout } from 'src/layouts-tailwind/dashboard';
import { AuthLayout } from 'src/layouts-tailwind/auth';

// ----------------------------------------------------------------------

describe('DashboardLayout (Tailwind)', () => {
  it('renders children in main content area', () => {
    const { container } = render(<DashboardLayout><p>Page content here</p></DashboardLayout>);
    expect(container.textContent).toContain('Page content here');
  });

  it('renders header when provided', () => {
    const { container } = render(
      <DashboardLayout header={<span>Header content</span>}>Content</DashboardLayout>
    );
    expect(container.textContent).toContain('Header content');
  });

  it('renders sidebar when provided', () => {
    const { container } = render(
      <DashboardLayout sidebar={<nav>Navigation</nav>}>Content</DashboardLayout>
    );
    expect(container.textContent).toContain('Navigation');
  });

  it('renders all sections together', () => {
    const { container } = render(
      <DashboardLayout
        header={<div data-testid="header">Header</div>}
        sidebar={<div data-testid="sidebar">Sidebar</div>}
      >
        <div data-testid="content">Content</div>
      </DashboardLayout>
    );
    expect(container.querySelector('[data-testid="header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="sidebar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="content"]')).toBeInTheDocument();
  });

  it('has dashboard layout data attribute', () => {
    const { container } = render(<DashboardLayout>Content</DashboardLayout>);
    expect(container.querySelector('[data-layout="dashboard"]')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <DashboardLayout className="custom-class">Content</DashboardLayout>
    );
    expect(container.querySelector('[data-layout="dashboard"]')).toHaveClass('custom-class');
  });

  it('does not render sidebar when not provided', () => {
    const { container } = render(<DashboardLayout>Content only</DashboardLayout>);
    expect(container.querySelector('aside')).not.toBeInTheDocument();
  });

  it('does not render header when not provided', () => {
    const { container } = render(<DashboardLayout>Content only</DashboardLayout>);
    expect(container.querySelector('header')).not.toBeInTheDocument();
  });
});

describe('AuthLayout (Tailwind)', () => {
  it('renders children', () => {
    const { container } = render(<AuthLayout>Sign in form</AuthLayout>);
    expect(container.textContent).toContain('Sign in form');
  });

  it('has auth layout data attribute', () => {
    const { container } = render(<AuthLayout>Content</AuthLayout>);
    expect(container.querySelector('[data-layout="auth"]')).toBeInTheDocument();
  });

  it('renders children in a card container', () => {
    const { container } = render(<AuthLayout>Card content</AuthLayout>);
    const cardEl = container.querySelector('.rounded-xl');
    expect(cardEl).toBeInTheDocument();
    expect(cardEl).toHaveClass('shadow-card');
    expect(cardEl).toHaveTextContent('Card content');
  });

  it('applies custom className', () => {
    const { container } = render(
      <AuthLayout className="custom-auth">Content</AuthLayout>
    );
    expect(container.querySelector('[data-layout="auth"]')).toHaveClass('custom-auth');
  });
});
