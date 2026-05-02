import { describe, it, expect } from 'vitest';
import { render } from 'src/__tests__/test-utils';

// ----------------------------------------------------------------------

const sampleNavData = [
  {
    subheader: 'Overview',
    items: [
      {
        title: 'Dashboard',
        path: '/admin',
        description: 'Main dashboard',
        icon: <span data-testid="icon-dashboard">📊</span>,
        matchPrefixes: ['/admin'],
      },
      {
        title: 'Reports',
        path: '/admin/reports',
        description: 'Analytics',
        icon: <span data-testid="icon-reports">📈</span>,
        matchPrefixes: ['/admin/reports'],
      },
    ],
  },
  {
    subheader: 'Content',
    items: [
      {
        title: 'Blog Posts',
        path: '/admin/blog',
        description: 'Manage blog',
        icon: <span data-testid="icon-blog">📝</span>,
        children: [
          { title: 'All Posts', path: '/admin/blog/posts' },
          { title: 'Categories', path: '/admin/blog/categories' },
        ],
      },
    ],
  },
];

// ----------------------------------------------------------------------

describe('SidebarNav', () => {
  it('renders all group subheaders', async () => {
    const { SidebarNav } = await import('src/layouts-tailwind/dashboard/nav');
    const { container } = render(<SidebarNav data={sampleNavData} />);
    expect(container.textContent).toContain('Overview');
    expect(container.textContent).toContain('Content');
  });

  it('renders all nav items', async () => {
    const { SidebarNav } = await import('src/layouts-tailwind/dashboard/nav');
    const { container } = render(<SidebarNav data={sampleNavData} />);
    expect(container.textContent).toContain('Dashboard');
    expect(container.textContent).toContain('Reports');
    expect(container.textContent).toContain('Blog Posts');
  });

  it('renders item icons', async () => {
    const { SidebarNav } = await import('src/layouts-tailwind/dashboard/nav');
    const { container } = render(<SidebarNav data={sampleNavData} />);
    expect(container.querySelector('[data-testid="icon-dashboard"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="icon-reports"]')).toBeInTheDocument();
  });

  it('highlights the active item', async () => {
    const { SidebarNav } = await import('src/layouts-tailwind/dashboard/nav');
    const { container } = render(
      <SidebarNav data={sampleNavData} currentPath="/admin/reports" />
    );
    const activeLinks = container.querySelectorAll('[data-active="true"]');
    expect(activeLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('renders child items when parent is expanded', async () => {
    const { SidebarNav } = await import('src/layouts-tailwind/dashboard/nav');
    const { container } = render(
      <SidebarNav data={sampleNavData} defaultExpanded={['/admin/blog']} />
    );
    expect(container.textContent).toContain('All Posts');
    expect(container.textContent).toContain('Categories');
  });

  it('hides subheader labels when collapsed', async () => {
    const { SidebarNav } = await import('src/layouts-tailwind/dashboard/nav');
    const { container } = render(<SidebarNav data={sampleNavData} collapsed />);
    expect(container.textContent).not.toContain('Overview');
    expect(container.textContent).not.toContain('Content');
    expect(container.querySelector('[data-testid="icon-dashboard"]')).toBeInTheDocument();
  });
});

describe('Nav item active detection', () => {
  it('matches exact path', async () => {
    const { isItemActive } = await import('src/layouts-tailwind/dashboard/nav');
    expect(isItemActive('/admin', { path: '/admin' })).toBe(true);
  });

  it('matches child path', async () => {
    const { isItemActive } = await import('src/layouts-tailwind/dashboard/nav');
    expect(
      isItemActive('/admin/blog/posts', {
        path: '/admin/blog',
        matchPrefixes: ['/admin/blog'],
      })
    ).toBe(true);
  });

  it("doesn't match different path", async () => {
    const { isItemActive } = await import('src/layouts-tailwind/dashboard/nav');
    expect(isItemActive('/admin/settings', { path: '/admin/reports' })).toBe(false);
  });

  it('uses matchPrefixes when provided', async () => {
    const { isItemActive } = await import('src/layouts-tailwind/dashboard/nav');
    expect(
      isItemActive('/admin/settings/brand', {
        path: '/admin/settings',
        matchPrefixes: ['/admin/settings/brand', '/admin/site-settings'],
      })
    ).toBe(true);
  });
});
