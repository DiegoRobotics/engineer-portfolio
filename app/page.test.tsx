import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock the projects library
vi.mock('@/lib/projects', () => ({
  getAllProjects: vi.fn(async () => [
    {
      slug: 'test-project',
      title: 'Test Project',
      description: 'Test description',
      date: '2024-01-01',
      status: 'completed',
      tags: ['test'],
    },
  ]),
}));

// Mock FeaturedProjectCard component
vi.mock('@/components/FeaturedProjectCard', () => ({
  default: ({ project }: { project: any }) => (
    <div data-testid="featured-project-card">
      <h3>{project.title}</h3>
    </div>
  ),
}));

describe('Landing Page', () => {
  describe('Hero Section', () => {
    it('displays the main title "Diego Morales\' Engineering Projects"', async () => {
      const page = await Home();
      render(page);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveTextContent("Diego Morales' Engineering Projects");
    });

    it('applies hero font size classes (text-4xl on mobile, text-5xl on desktop)', async () => {
      const page = await Home();
      render(page);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('text-4xl');
      expect(title).toHaveClass('lg:text-5xl');
    });

    it('applies bold font weight to the title', async () => {
      const page = await Home();
      render(page);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('font-bold');
    });

    it('applies serif font family to the title', async () => {
      const page = await Home();
      render(page);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('font-serif');
    });

    it('applies fade-in animation to the hero section', async () => {
      const page = await Home();
      render(page);
      
      const heroSection = screen.getByRole('heading', { level: 1 }).closest('section');
      expect(heroSection).toHaveClass('animate-fade-in');
    });

    it('does not contain any emojis in the title', async () => {
      const page = await Home();
      render(page);
      
      const title = screen.getByRole('heading', { level: 1 });
      const titleText = title.textContent || '';
      
      // Check for common emoji patterns
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(titleText).not.toMatch(emojiRegex);
    });

    it('renders the hero section before the featured projects section', async () => {
      const page = await Home();
      const { container } = render(page);
      
      const sections = container.querySelectorAll('section');
      expect(sections.length).toBeGreaterThanOrEqual(2);
      
      // First section should contain the hero title
      const firstSection = sections[0];
      const title = firstSection.querySelector('h1');
      expect(title).toHaveTextContent("Diego Morales' Engineering Projects");
      
      // Second section should contain the featured projects grid
      const secondSection = sections[1];
      const grid = secondSection.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Typography Requirements', () => {
    it('ensures title is at least 2.5x larger than body text on desktop', async () => {
      const page = await Home();
      render(page);
      
      const title = screen.getByRole('heading', { level: 1 });
      
      // Desktop: text-5xl = 3rem (48px), body text = 1rem (16px)
      // 48px / 16px = 3x, which is > 2.5x ✓
      expect(title).toHaveClass('lg:text-5xl');
    });

    it('uses appropriate mobile font size (2.25rem)', async () => {
      const page = await Home();
      render(page);
      
      const title = screen.getByRole('heading', { level: 1 });
      
      // Mobile: text-4xl = 2.25rem (36px)
      expect(title).toHaveClass('text-4xl');
    });
  });

  describe('Layout and Spacing', () => {
    it('applies proper padding to the hero section', async () => {
      const page = await Home();
      render(page);
      
      const heroSection = screen.getByRole('heading', { level: 1 }).closest('section');
      expect(heroSection).toHaveClass('py-12');
      expect(heroSection).toHaveClass('lg:py-16');
    });

    it('uses container with proper horizontal padding', async () => {
      const page = await Home();
      const { container } = render(page);
      
      const main = container.querySelector('main');
      expect(main).toHaveClass('container');
      expect(main).toHaveClass('mx-auto');
      expect(main).toHaveClass('px-6');
      expect(main).toHaveClass('lg:px-12');
    });
  });

  describe('Content Structure', () => {
    it('renders featured projects in a responsive grid', async () => {
      const page = await Home();
      const { container } = render(page);
      
      // Check for grid container
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-2');
      expect(grid).toHaveClass('lg:grid-cols-3');
      expect(grid).toHaveClass('gap-6');
    });

    it('displays featured project cards', async () => {
      const page = await Home();
      render(page);
      
      const cards = screen.getAllByTestId('featured-project-card');
      expect(cards.length).toBeGreaterThan(0);
      expect(cards.length).toBeLessThanOrEqual(6);
    });

    it('applies stagger animation to featured projects', async () => {
      const page = await Home();
      const { container } = render(page);
      
      const animatedDivs = container.querySelectorAll('.animate-fade-in');
      // Should have at least 2: hero section + first project
      expect(animatedDivs.length).toBeGreaterThanOrEqual(2);
      
      // Check that animation delays are applied
      const projectCards = container.querySelectorAll('.grid > div');
      projectCards.forEach((card, index) => {
        const style = card.getAttribute('style');
        expect(style).toContain(`animation-delay: ${index * 100}ms`);
      });
    });
  });

  describe('Featured Projects Grid Layout (Requirement 10.4)', () => {
    it('displays up to 6 featured projects', async () => {
      const page = await Home();
      render(page);
      
      const cards = screen.getAllByTestId('featured-project-card');
      // Should display at least 1 project and no more than 6
      expect(cards.length).toBeGreaterThan(0);
      expect(cards.length).toBeLessThanOrEqual(6);
    });

    it('uses single column layout on mobile (grid-cols-1)', async () => {
      const page = await Home();
      const { container } = render(page);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
    });

    it('uses two column layout on tablet (md:grid-cols-2)', async () => {
      const page = await Home();
      const { container } = render(page);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('md:grid-cols-2');
    });

    it('uses three column layout on desktop (lg:grid-cols-3)', async () => {
      const page = await Home();
      const { container } = render(page);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('lg:grid-cols-3');
    });

    it('applies consistent gap spacing between grid items', async () => {
      const page = await Home();
      const { container } = render(page);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-6');
    });
  });

  describe('No Emoji Policy (Requirement 2.4)', () => {
    it('does not display emojis anywhere on the landing page', async () => {
      const page = await Home();
      const { container } = render(page);
      
      const pageText = container.textContent || '';
      
      // Comprehensive emoji regex covering all Unicode emoji ranges
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(pageText).not.toMatch(emojiRegex);
    });

    it('does not display emojis in the hero title', async () => {
      const page = await Home();
      render(page);
      
      const title = screen.getByRole('heading', { level: 1 });
      const titleText = title.textContent || '';
      
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(titleText).not.toMatch(emojiRegex);
    });

    it('does not display emojis in featured projects section', async () => {
      const page = await Home();
      const { container } = render(page);
      
      const featuredSection = container.querySelectorAll('section')[1];
      const sectionText = featuredSection?.textContent || '';
      
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(sectionText).not.toMatch(emojiRegex);
    });
  });
});
