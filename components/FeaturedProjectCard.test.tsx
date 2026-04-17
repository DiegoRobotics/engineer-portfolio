import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeaturedProjectCard from './FeaturedProjectCard';
import { ProjectMeta } from '@/lib/projects';

describe('FeaturedProjectCard', () => {
  const mockProject: ProjectMeta = {
    slug: 'test-project',
    title: 'Test Project',
    description: 'This is a test project description that should be displayed on the card.',
    date: '2024-01-15',
    status: 'Completed',
    tags: ['test', 'demo'],
  };

  it('renders project title with serif font', () => {
    render(<FeaturedProjectCard project={mockProject} />);
    const title = screen.getByRole('heading', { name: 'Test Project' });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('font-serif');
  });

  it('renders project description', () => {
    render(<FeaturedProjectCard project={mockProject} />);
    expect(screen.getByText(/This is a test project description/)).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    render(<FeaturedProjectCard project={mockProject} />);
    const dateElement = screen.getByText('January 14, 2024');
    expect(dateElement).toBeInTheDocument();
  });

  it('renders project status', () => {
    render(<FeaturedProjectCard project={mockProject} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('links to project detail page', () => {
    render(<FeaturedProjectCard project={mockProject} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/projects/test-project');
  });

  it('applies card styling with padding, border, and shadow', () => {
    const { container } = render(<FeaturedProjectCard project={mockProject} />);
    const article = container.querySelector('article');
    expect(article).toHaveClass('p-6');
    expect(article).toHaveClass('border');
    expect(article).toHaveClass('border-neutral-200');
    expect(article).toHaveClass('shadow-sm');
  });

  it('applies hover state with scale and shadow transition', () => {
    const { container } = render(<FeaturedProjectCard project={mockProject} />);
    const article = container.querySelector('article');
    expect(article).toHaveClass('hover:scale-[1.02]');
    expect(article).toHaveClass('hover:shadow-md');
    expect(article).toHaveClass('transition-all');
    expect(article).toHaveClass('duration-200');
  });

  it('renders thumbnail when provided', () => {
    const projectWithThumbnail: ProjectMeta = {
      ...mockProject,
      thumbnail: '/images/test-thumbnail.jpg',
    };
    render(<FeaturedProjectCard project={projectWithThumbnail} />);
    const img = screen.getByAltText('Test Project');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/images/test-thumbnail.jpg');
  });

  it('does not render thumbnail when not provided', () => {
    render(<FeaturedProjectCard project={mockProject} />);
    const img = screen.queryByRole('img');
    expect(img).not.toBeInTheDocument();
  });

  it('uses appropriate font sizing for title', () => {
    render(<FeaturedProjectCard project={mockProject} />);
    const title = screen.getByRole('heading', { name: 'Test Project' });
    expect(title).toHaveClass('text-2xl');
    expect(title).toHaveClass('lg:text-section');
  });

  it('applies semibold font weight to title', () => {
    render(<FeaturedProjectCard project={mockProject} />);
    const title = screen.getByRole('heading', { name: 'Test Project' });
    expect(title).toHaveClass('font-semibold');
  });

  it('renders as an article element for semantic HTML', () => {
    const { container } = render(<FeaturedProjectCard project={mockProject} />);
    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();
  });

  it('includes date in ISO format for datetime attribute', () => {
    render(<FeaturedProjectCard project={mockProject} />);
    const timeElement = screen.getByText('January 14, 2024').closest('time');
    expect(timeElement).toHaveAttribute('datetime', '2024-01-15');
  });

  describe('No Emoji Policy', () => {
    it('does not display emojis in the project title', () => {
      render(<FeaturedProjectCard project={mockProject} />);
      const title = screen.getByRole('heading', { name: 'Test Project' });
      const titleText = title.textContent || '';
      
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(titleText).not.toMatch(emojiRegex);
    });

    it('does not display emojis in the project description', () => {
      render(<FeaturedProjectCard project={mockProject} />);
      const description = screen.getByText(/This is a test project description/);
      const descriptionText = description.textContent || '';
      
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(descriptionText).not.toMatch(emojiRegex);
    });

    it('does not display emojis in the project status', () => {
      render(<FeaturedProjectCard project={mockProject} />);
      const status = screen.getByText('Completed');
      const statusText = status.textContent || '';
      
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(statusText).not.toMatch(emojiRegex);
    });

    it('does not display emojis anywhere in the card', () => {
      const { container } = render(<FeaturedProjectCard project={mockProject} />);
      const cardText = container.textContent || '';
      
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
      expect(cardText).not.toMatch(emojiRegex);
    });
  });

  describe('Responsive Layout and Props', () => {
    it('renders correctly with all required props', () => {
      render(<FeaturedProjectCard project={mockProject} />);
      
      // Verify all required props are rendered
      expect(screen.getByRole('heading', { name: 'Test Project' })).toBeInTheDocument();
      expect(screen.getByText(/This is a test project description/)).toBeInTheDocument();
      expect(screen.getByText('January 14, 2024')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/test-project');
    });

    it('renders correctly with optional thumbnail prop', () => {
      const projectWithThumbnail: ProjectMeta = {
        ...mockProject,
        thumbnail: '/images/test-thumbnail.jpg',
      };
      render(<FeaturedProjectCard project={projectWithThumbnail} />);
      
      const img = screen.getByAltText('Test Project');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/test-thumbnail.jpg');
    });

    it('renders correctly without optional thumbnail prop', () => {
      render(<FeaturedProjectCard project={mockProject} />);
      
      const img = screen.queryByRole('img');
      expect(img).not.toBeInTheDocument();
    });

    it('maintains proper aspect ratio for thumbnail', () => {
      const projectWithThumbnail: ProjectMeta = {
        ...mockProject,
        thumbnail: '/images/test-thumbnail.jpg',
      };
      const { container } = render(<FeaturedProjectCard project={projectWithThumbnail} />);
      
      const thumbnailContainer = container.querySelector('.aspect-video');
      expect(thumbnailContainer).toBeInTheDocument();
    });
  });
});
