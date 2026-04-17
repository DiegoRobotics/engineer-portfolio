import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from './layout';

describe('RootLayout', () => {
  it('renders children within the layout structure', () => {
    render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('applies correct font classes to html element', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    const html = container.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');
    // Font variables are applied as CSS custom properties
    expect(html?.className).toContain('--font-serif');
    expect(html?.className).toContain('--font-sans');
  });

  it('applies correct body classes', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    const body = container.querySelector('body');
    expect(body).toHaveClass('font-sans', 'bg-neutral-50', 'text-neutral-900', 'antialiased');
  });

  it('renders Header component', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    // Header should be present (it contains navigation links)
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders Footer component', () => {
    render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    // Footer should be present (it contains copyright text)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders main content area with flex-1 class', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-content">Test</div>
      </RootLayout>
    );

    const main = container.querySelector('main');
    expect(main).toHaveClass('flex-1');
  });

  it('uses flex column layout for min-h-screen container', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );

    const flexContainer = container.querySelector('.flex.min-h-screen.flex-col');
    expect(flexContainer).toBeInTheDocument();
  });
});

// Integration tests for root layout - Task 4.2
describe('RootLayout Integration Tests', () => {
  describe('Header renders on all pages', () => {
    it('renders Header with navigation on landing page content', () => {
      render(
        <RootLayout>
          <div data-testid="landing-page">
            <h1>Diego Morales&apos; Engineering Projects</h1>
          </div>
        </RootLayout>
      );

      // Verify Header is present
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      // Verify page content is also present
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });

    it('renders Header with navigation on projects page content', () => {
      render(
        <RootLayout>
          <div data-testid="projects-page">
            <h1>All Projects</h1>
          </div>
        </RootLayout>
      );

      // Verify Header is present
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      // Verify page content is also present
      expect(screen.getByTestId('projects-page')).toBeInTheDocument();
    });

    it('renders Header with navigation on about page content', () => {
      render(
        <RootLayout>
          <div data-testid="about-page">
            <h1>About Me</h1>
          </div>
        </RootLayout>
      );

      // Verify Header is present
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      // Verify page content is also present
      expect(screen.getByTestId('about-page')).toBeInTheDocument();
    });

    it('renders Header with navigation on project detail page content', () => {
      render(
        <RootLayout>
          <div data-testid="project-detail-page">
            <h1>Project Title</h1>
            <p>Project description</p>
          </div>
        </RootLayout>
      );

      // Verify Header is present
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      // Verify page content is also present
      expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
    });
  });

  describe('Footer renders on all pages', () => {
    it('renders Footer on landing page content', () => {
      render(
        <RootLayout>
          <div data-testid="landing-page">
            <h1>Diego Morales&apos; Engineering Projects</h1>
          </div>
        </RootLayout>
      );

      // Verify Footer is present
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      
      // Verify page content is also present
      expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    });

    it('renders Footer on projects page content', () => {
      render(
        <RootLayout>
          <div data-testid="projects-page">
            <h1>All Projects</h1>
          </div>
        </RootLayout>
      );

      // Verify Footer is present
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      
      // Verify page content is also present
      expect(screen.getByTestId('projects-page')).toBeInTheDocument();
    });

    it('renders Footer on about page content', () => {
      render(
        <RootLayout>
          <div data-testid="about-page">
            <h1>About Me</h1>
          </div>
        </RootLayout>
      );

      // Verify Footer is present
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      
      // Verify page content is also present
      expect(screen.getByTestId('about-page')).toBeInTheDocument();
    });

    it('renders Footer on project detail page content', () => {
      render(
        <RootLayout>
          <div data-testid="project-detail-page">
            <h1>Project Title</h1>
            <p>Project description</p>
          </div>
        </RootLayout>
      );

      // Verify Footer is present
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      
      // Verify page content is also present
      expect(screen.getByTestId('project-detail-page')).toBeInTheDocument();
    });
  });

  describe('Main content area has correct spacing', () => {
    it('main element has flex-1 class for proper spacing', () => {
      const { container } = render(
        <RootLayout>
          <div data-testid="page-content">Content</div>
        </RootLayout>
      );

      const main = container.querySelector('main');
      expect(main).toHaveClass('flex-1');
    });

    it('main element is positioned between Header and Footer', () => {
      const { container } = render(
        <RootLayout>
          <div data-testid="page-content">Content</div>
        </RootLayout>
      );

      const flexContainer = container.querySelector('.flex.min-h-screen.flex-col');
      expect(flexContainer).toBeInTheDocument();
      
      // Verify structure: Header -> Main -> Footer
      const children = flexContainer?.children;
      expect(children).toHaveLength(3);
      
      // First child should be Header (contains nav)
      expect(children?.[0].querySelector('nav')).toBeInTheDocument();
      
      // Second child should be Main
      expect(children?.[1].tagName).toBe('MAIN');
      expect(children?.[1]).toHaveClass('flex-1');
      
      // Third child should be Footer (footer tag has implicit contentinfo role)
      expect(children?.[2].tagName).toBe('FOOTER');
    });

    it('main content area expands to fill available space', () => {
      const { container } = render(
        <RootLayout>
          <div data-testid="page-content">
            <p>Short content</p>
          </div>
        </RootLayout>
      );

      const main = container.querySelector('main');
      
      // flex-1 class ensures main expands to fill space
      expect(main).toHaveClass('flex-1');
      
      // Parent container has min-h-screen to ensure full viewport height
      const flexContainer = container.querySelector('.flex.min-h-screen.flex-col');
      expect(flexContainer).toBeInTheDocument();
    });

    it('main content area contains page children correctly', () => {
      render(
        <RootLayout>
          <div data-testid="page-content">
            <h1>Page Title</h1>
            <p>Page content</p>
          </div>
        </RootLayout>
      );

      // Verify page content is inside main element
      const pageContent = screen.getByTestId('page-content');
      expect(pageContent.closest('main')).toBeInTheDocument();
      
      // Verify content is accessible
      expect(screen.getByText('Page Title')).toBeInTheDocument();
      expect(screen.getByText('Page content')).toBeInTheDocument();
    });
  });
});

describe('metadata', () => {
  it('has correct title configuration', () => {
    expect(metadata.title).toHaveProperty('default');
    expect(metadata.title).toHaveProperty('template');
  });

  it('has description', () => {
    expect(metadata.description).toBeDefined();
  });

  it('has keywords array', () => {
    expect(Array.isArray(metadata.keywords)).toBe(true);
  });

  it('has authors array', () => {
    expect(Array.isArray(metadata.authors)).toBe(true);
  });

  it('has creator field', () => {
    expect(metadata.creator).toBeDefined();
  });

  it('has openGraph configuration', () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.type).toBe('website');
    expect(metadata.openGraph?.locale).toBe('en_US');
  });

  it('has twitter card configuration', () => {
    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter?.card).toBe('summary_large_image');
  });
});
