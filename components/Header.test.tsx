import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

// Mock next/navigation
const mockUsePathname = vi.fn(() => '/');
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

// Mock site config
vi.mock('@/config/site', () => ({
  siteConfig: {
    title: 'Test Portfolio',
  },
}));

describe('Header', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/');
  });

  describe('Navigation Links Rendering', () => {
    it('renders all three navigation links correctly', () => {
      render(<Header />);
      
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Projects' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    });

    it('renders site title from config as a link', () => {
      render(<Header />);
      
      const titleLink = screen.getByRole('link', { name: 'Test Portfolio' });
      expect(titleLink).toBeInTheDocument();
      expect(titleLink).toHaveAttribute('href', '/');
    });

    it('renders navigation links with correct href attributes', () => {
      render(<Header />);
      
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    });

    it('renders navigation links in correct order', () => {
      render(<Header />);
      
      const links = screen.getAllByRole('link');
      const navLinks = links.filter(link => 
        ['Home', 'Projects', 'About'].includes(link.textContent || '')
      );
      
      expect(navLinks[0]).toHaveTextContent('Home');
      expect(navLinks[1]).toHaveTextContent('Projects');
      expect(navLinks[2]).toHaveTextContent('About');
    });

    it('uses 1.5rem spacing between navigation links', () => {
      const { container } = render(<Header />);
      const navList = container.querySelector('ul');
      
      expect(navList).toHaveClass('gap-6'); // gap-6 = 1.5rem in Tailwind
    });
  });

  describe('Active State', () => {
    it('applies active state to Home link when on home page', () => {
      mockUsePathname.mockReturnValue('/');
      render(<Header />);
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('text-neutral-900', 'underline', 'decoration-2', 'underline-offset-4');
      
      const projectsLink = screen.getByRole('link', { name: 'Projects' });
      expect(projectsLink).toHaveClass('text-neutral-600');
      expect(projectsLink).not.toHaveClass('underline');
    });

    it('applies active state to Projects link when on projects page', () => {
      mockUsePathname.mockReturnValue('/projects');
      render(<Header />);
      
      const projectsLink = screen.getByRole('link', { name: 'Projects' });
      expect(projectsLink).toHaveClass('text-neutral-900', 'underline', 'decoration-2', 'underline-offset-4');
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('text-neutral-600');
      expect(homeLink).not.toHaveClass('underline');
    });

    it('applies active state to Projects link when on project detail page', () => {
      mockUsePathname.mockReturnValue('/projects/test-project');
      render(<Header />);
      
      const projectsLink = screen.getByRole('link', { name: 'Projects' });
      expect(projectsLink).toHaveClass('text-neutral-900', 'underline', 'decoration-2', 'underline-offset-4');
    });

    it('applies active state to About link when on about page', () => {
      mockUsePathname.mockReturnValue('/about');
      render(<Header />);
      
      const aboutLink = screen.getByRole('link', { name: 'About' });
      expect(aboutLink).toHaveClass('text-neutral-900', 'underline', 'decoration-2', 'underline-offset-4');
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('text-neutral-600');
      expect(homeLink).not.toHaveClass('underline');
    });

    it('applies correct underline styling with 2px thickness and 4px offset', () => {
      mockUsePathname.mockReturnValue('/');
      render(<Header />);
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('decoration-2'); // 2px thickness
      expect(homeLink).toHaveClass('underline-offset-4'); // 4px offset
    });

    it('only one navigation link has active state at a time', () => {
      mockUsePathname.mockReturnValue('/projects');
      render(<Header />);
      
      const links = [
        screen.getByRole('link', { name: 'Home' }),
        screen.getByRole('link', { name: 'Projects' }),
        screen.getByRole('link', { name: 'About' }),
      ];
      
      const activeLinks = links.filter(link => link.classList.contains('underline'));
      expect(activeLinks).toHaveLength(1);
      expect(activeLinks[0]).toHaveTextContent('Projects');
    });
  });

  describe('Hover State Transitions', () => {
    it('applies transition classes to all navigation links', () => {
      render(<Header />);
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      const projectsLink = screen.getByRole('link', { name: 'Projects' });
      const aboutLink = screen.getByRole('link', { name: 'About' });
      
      [homeLink, projectsLink, aboutLink].forEach(link => {
        expect(link).toHaveClass('transition-colors');
        expect(link).toHaveClass('duration-200');
        expect(link).toHaveClass('ease-in-out');
      });
    });

    it('applies hover color class to navigation links', () => {
      render(<Header />);
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('hover:text-neutral-900');
    });

    it('uses 200ms transition duration as per design spec', () => {
      render(<Header />);
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('duration-200'); // 200ms
    });

    it('uses ease-in-out timing function', () => {
      render(<Header />);
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('ease-in-out');
    });
  });

  describe('Responsive Behavior', () => {
    it('applies sticky positioning at top of viewport', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('sticky', 'top-0', 'z-50');
    });

    it('applies correct height for mobile viewport (64px)', () => {
      const { container } = render(<Header />);
      const nav = container.querySelector('nav');
      
      expect(nav).toHaveClass('h-16'); // h-16 = 4rem = 64px
    });

    it('applies correct height for desktop viewport (72px)', () => {
      const { container } = render(<Header />);
      const nav = container.querySelector('nav');
      
      expect(nav).toHaveClass('lg:h-18'); // lg:h-18 = 4.5rem = 72px
    });

    it('applies responsive horizontal padding', () => {
      const { container } = render(<Header />);
      const contentDiv = container.querySelector('.mx-auto');
      
      expect(contentDiv).toHaveClass('px-6'); // Mobile: 1.5rem
      expect(contentDiv).toHaveClass('lg:px-12'); // Desktop: 3rem
    });

    it('applies max-width container constraint', () => {
      const { container } = render(<Header />);
      const contentDiv = container.querySelector('.mx-auto');
      
      expect(contentDiv).toHaveClass('max-w-container');
    });

    it('uses flexbox for responsive layout', () => {
      const { container } = render(<Header />);
      const nav = container.querySelector('nav');
      
      expect(nav).toHaveClass('flex', 'items-center', 'justify-between');
    });

    it('navigation links are displayed horizontally', () => {
      const { container } = render(<Header />);
      const navList = container.querySelector('ul');
      
      expect(navList).toHaveClass('flex');
    });

    it('maintains proper spacing between elements at all breakpoints', () => {
      const { container } = render(<Header />);
      const navList = container.querySelector('ul');
      
      // Gap-6 provides consistent spacing across breakpoints
      expect(navList).toHaveClass('gap-6');
    });
  });

  describe('Visual Styling', () => {
    it('uses neutral color scheme for background', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('bg-neutral-50');
    });

    it('applies bottom border with neutral color', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('border-b', 'border-neutral-200');
    });

    it('applies correct text color to site title', () => {
      render(<Header />);
      const titleLink = screen.getByRole('link', { name: 'Test Portfolio' });
      
      expect(titleLink).toHaveClass('text-neutral-900');
    });

    it('applies correct font styling to site title', () => {
      render(<Header />);
      const titleLink = screen.getByRole('link', { name: 'Test Portfolio' });
      
      expect(titleLink).toHaveClass('text-xl', 'font-bold');
    });

    it('applies correct font size to navigation links', () => {
      render(<Header />);
      const homeLink = screen.getByRole('link', { name: 'Home' });
      
      expect(homeLink).toHaveClass('text-sm', 'font-medium');
    });

    it('inactive links use neutral-600 color', () => {
      mockUsePathname.mockReturnValue('/');
      render(<Header />);
      
      const projectsLink = screen.getByRole('link', { name: 'Projects' });
      expect(projectsLink).toHaveClass('text-neutral-600');
    });

    it('active links use neutral-900 color', () => {
      mockUsePathname.mockReturnValue('/');
      render(<Header />);
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveClass('text-neutral-900');
    });
  });

  describe('Accessibility and Standards', () => {
    it('uses semantic header element', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      
      expect(header).toBeInTheDocument();
    });

    it('uses semantic nav element', () => {
      const { container } = render(<Header />);
      const nav = container.querySelector('nav');
      
      expect(nav).toBeInTheDocument();
    });

    it('uses semantic list elements for navigation', () => {
      const { container } = render(<Header />);
      const ul = container.querySelector('ul');
      const li = container.querySelectorAll('li');
      
      expect(ul).toBeInTheDocument();
      expect(li.length).toBe(3);
    });

    it('does not display any emojis', () => {
      render(<Header />);
      const { container } = render(<Header />);
      const text = container.textContent || '';
      
      // Check for common emoji patterns
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(text).not.toMatch(emojiRegex);
    });

    it('all links are keyboard accessible', () => {
      render(<Header />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toBeInTheDocument();
        expect(link.tagName).toBe('A');
      });
    });
  });

  describe('Layout Structure', () => {
    it('renders header as top-level element', () => {
      const { container } = render(<Header />);
      const header = container.firstChild;
      
      expect(header?.nodeName).toBe('HEADER');
    });

    it('contains navigation within header', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      const nav = header?.querySelector('nav');
      
      expect(nav).toBeInTheDocument();
    });

    it('site title appears before navigation links', () => {
      render(<Header />);
      
      const allLinks = screen.getAllByRole('link');
      const titleLink = screen.getByRole('link', { name: 'Test Portfolio' });
      
      expect(allLinks[0]).toBe(titleLink);
    });

    it('maintains proper z-index for sticky positioning', () => {
      const { container } = render(<Header />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('z-50');
    });
  });
});
