import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectGrid from './ProjectGrid';
import { ProjectMeta } from '@/lib/projects';

describe('ProjectGrid', () => {
  it('renders a grid of project cards', () => {
    const projects: ProjectMeta[] = [
      {
        slug: 'project-1',
        title: 'Project One',
        description: 'First project',
        date: '2024-01-01',
        status: 'Completed',
        tags: ['software'],
        thumbnail: '/images/project-1.jpg',
      },
      {
        slug: 'project-2',
        title: 'Project Two',
        description: 'Second project',
        date: '2024-01-02',
        status: 'In Progress',
        tags: ['hardware'],
      },
    ];

    render(<ProjectGrid projects={projects} />);

    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Two')).toBeInTheDocument();
  });

  it('returns null when projects array is empty', () => {
    const { container } = render(<ProjectGrid projects={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies responsive grid classes', () => {
    const projects: ProjectMeta[] = [
      {
        slug: 'project-1',
        title: 'Project One',
        description: 'First project',
        date: '2024-01-01',
        status: 'Completed',
        tags: [],
      },
    ];

    const { container } = render(<ProjectGrid projects={projects} />);
    const gridElement = container.querySelector('.grid');
    
    expect(gridElement).toHaveClass('grid-cols-1');
    expect(gridElement).toHaveClass('md:grid-cols-2');
    expect(gridElement).toHaveClass('lg:grid-cols-3');
    expect(gridElement).toHaveClass('gap-6');
  });
});
