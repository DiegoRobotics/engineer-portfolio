import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import HomeClient from './HomeClient';
import type { ProjectMeta } from '@/lib/projects';

// Mock child components to isolate HomeClient testing
vi.mock('./TagFilter', () => ({
  default: ({ tags, activeTag, onChange }: { tags: string[]; activeTag: string | null; onChange: (tag: string | null) => void }) => (
    <div data-testid="tag-filter">
      <button onClick={() => onChange(null)}>All</button>
      {tags.map(tag => (
        <button key={tag} onClick={() => onChange(tag)}>
          {tag}
        </button>
      ))}
      <span data-testid="active-tag">{activeTag || 'null'}</span>
    </div>
  ),
}));

vi.mock('./ProjectGrid', () => ({
  default: ({ projects }: { projects: ProjectMeta[] }) => (
    <div data-testid="project-grid">
      {projects.map(project => (
        <div key={project.slug} data-testid={`project-${project.slug}`}>
          {project.title}
        </div>
      ))}
    </div>
  ),
}));

describe('HomeClient - Unit Tests', () => {
  const mockProjects: ProjectMeta[] = [
    {
      slug: 'robot-arm',
      title: 'Robot Arm',
      description: 'A robotic arm project',
      date: '2024-01-15',
      status: 'Completed',
      tags: ['mechanical', 'software'],
      thumbnail: '/images/robot.jpg',
    },
    {
      slug: 'fluid-sim',
      title: 'Fluid Simulator',
      description: 'A fluid dynamics simulator',
      date: '2024-02-20',
      status: 'In Progress',
      tags: ['simulation', 'software'],
    },
    {
      slug: 'drone',
      title: 'Autonomous Drone',
      description: 'An autonomous drone',
      date: '2024-03-10',
      status: 'Completed',
      tags: ['hardware', 'software'],
    },
  ];

  const mockTags = ['mechanical', 'software', 'simulation', 'hardware'];

  it('renders ProjectGrid with all projects initially', () => {
    render(<HomeClient projects={mockProjects} tags={mockTags} />);
    
    const projectGrid = screen.getByTestId('project-grid');
    expect(projectGrid).toBeInTheDocument();
    
    // All three projects should be rendered
    expect(screen.getByTestId('project-robot-arm')).toBeInTheDocument();
    expect(screen.getByTestId('project-fluid-sim')).toBeInTheDocument();
    expect(screen.getByTestId('project-drone')).toBeInTheDocument();
  });

  it('renders TagFilter with correct tags', () => {
    render(<HomeClient projects={mockProjects} tags={mockTags} />);
    
    const tagFilter = screen.getByTestId('tag-filter');
    expect(tagFilter).toBeInTheDocument();
    
    // Verify all tags are passed to TagFilter
    expect(within(tagFilter).getByRole('button', { name: 'mechanical' })).toBeInTheDocument();
    expect(within(tagFilter).getByRole('button', { name: 'software' })).toBeInTheDocument();
    expect(within(tagFilter).getByRole('button', { name: 'simulation' })).toBeInTheDocument();
    expect(within(tagFilter).getByRole('button', { name: 'hardware' })).toBeInTheDocument();
  });

  it('passes correct props to TagFilter (tags, activeTag, onChange)', () => {
    render(<HomeClient projects={mockProjects} tags={mockTags} />);
    
    const tagFilter = screen.getByTestId('tag-filter');
    
    // Verify activeTag is initially null
    expect(within(tagFilter).getByTestId('active-tag')).toHaveTextContent('null');
    
    // Verify onChange works by clicking a tag
    const softwareButton = within(tagFilter).getByRole('button', { name: 'software' });
    fireEvent.click(softwareButton);
    
    // After clicking, activeTag should update
    expect(within(tagFilter).getByTestId('active-tag')).toHaveTextContent('software');
  });

  it('shows "No projects match the selected filter" message when filtered list is empty', () => {
    // Use projects that don't have a specific tag
    const projectsWithoutTag: ProjectMeta[] = [
      {
        slug: 'project1',
        title: 'Project 1',
        description: 'Description',
        date: '2024-01-01',
        status: 'Completed',
        tags: ['tag1', 'tag2'],
      },
    ];
    
    render(<HomeClient projects={projectsWithoutTag} tags={['tag1', 'tag2', 'tag3']} />);
    
    // Click on a tag that doesn't match any projects
    const tagFilter = screen.getByTestId('tag-filter');
    const tag3Button = within(tagFilter).getByRole('button', { name: 'tag3' });
    fireEvent.click(tag3Button);
    
    // Empty state message should appear
    expect(screen.getByText('No projects match the selected filter')).toBeInTheDocument();
    
    // ProjectGrid should not be rendered
    expect(screen.queryByTestId('project-grid')).not.toBeInTheDocument();
  });

  it('filters projects correctly when tag is selected', () => {
    render(<HomeClient projects={mockProjects} tags={mockTags} />);
    
    // Initially all projects are shown
    expect(screen.getByTestId('project-robot-arm')).toBeInTheDocument();
    expect(screen.getByTestId('project-fluid-sim')).toBeInTheDocument();
    expect(screen.getByTestId('project-drone')).toBeInTheDocument();
    
    // Click on 'mechanical' tag (only robot-arm has this tag)
    const tagFilter = screen.getByTestId('tag-filter');
    const mechanicalButton = within(tagFilter).getByRole('button', { name: 'mechanical' });
    fireEvent.click(mechanicalButton);
    
    // Only robot-arm should be visible
    expect(screen.getByTestId('project-robot-arm')).toBeInTheDocument();
    expect(screen.queryByTestId('project-fluid-sim')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-drone')).not.toBeInTheDocument();
  });

  it('shows all projects when "All" is selected (activeTag is null)', () => {
    render(<HomeClient projects={mockProjects} tags={mockTags} />);
    
    const tagFilter = screen.getByTestId('tag-filter');
    
    // First, select a specific tag
    const mechanicalButton = within(tagFilter).getByRole('button', { name: 'mechanical' });
    fireEvent.click(mechanicalButton);
    
    // Only one project should be visible
    expect(screen.getByTestId('project-robot-arm')).toBeInTheDocument();
    expect(screen.queryByTestId('project-fluid-sim')).not.toBeInTheDocument();
    
    // Click "All" to clear filter
    const allButton = within(tagFilter).getByRole('button', { name: 'All' });
    fireEvent.click(allButton);
    
    // All projects should be visible again
    expect(screen.getByTestId('project-robot-arm')).toBeInTheDocument();
    expect(screen.getByTestId('project-fluid-sim')).toBeInTheDocument();
    expect(screen.getByTestId('project-drone')).toBeInTheDocument();
  });

  it('updates filtered projects when activeTag changes', () => {
    render(<HomeClient projects={mockProjects} tags={mockTags} />);
    
    const tagFilter = screen.getByTestId('tag-filter');
    
    // Select 'software' tag (robot-arm, fluid-sim, and drone all have this)
    const softwareButton = within(tagFilter).getByRole('button', { name: 'software' });
    fireEvent.click(softwareButton);
    
    expect(screen.getByTestId('project-robot-arm')).toBeInTheDocument();
    expect(screen.getByTestId('project-fluid-sim')).toBeInTheDocument();
    expect(screen.getByTestId('project-drone')).toBeInTheDocument();
    
    // Change to 'simulation' tag (only fluid-sim has this)
    const simulationButton = within(tagFilter).getByRole('button', { name: 'simulation' });
    fireEvent.click(simulationButton);
    
    expect(screen.queryByTestId('project-robot-arm')).not.toBeInTheDocument();
    expect(screen.getByTestId('project-fluid-sim')).toBeInTheDocument();
    expect(screen.queryByTestId('project-drone')).not.toBeInTheDocument();
    
    // Change to 'hardware' tag (only drone has this)
    const hardwareButton = within(tagFilter).getByRole('button', { name: 'hardware' });
    fireEvent.click(hardwareButton);
    
    expect(screen.queryByTestId('project-robot-arm')).not.toBeInTheDocument();
    expect(screen.queryByTestId('project-fluid-sim')).not.toBeInTheDocument();
    expect(screen.getByTestId('project-drone')).toBeInTheDocument();
  });

  it('renders correctly with empty projects array', () => {
    render(<HomeClient projects={[]} tags={[]} />);
    
    // TagFilter should still render
    expect(screen.getByTestId('tag-filter')).toBeInTheDocument();
    
    // Empty state message should appear
    expect(screen.getByText('No projects match the selected filter')).toBeInTheDocument();
  });

  it('renders correctly with projects but empty tags array', () => {
    const projectsWithoutTags: ProjectMeta[] = [
      {
        slug: 'project1',
        title: 'Project 1',
        description: 'Description',
        date: '2024-01-01',
        status: 'Completed',
        tags: [],
      },
    ];
    
    render(<HomeClient projects={projectsWithoutTags} tags={[]} />);
    
    // TagFilter should render with no tags
    const tagFilter = screen.getByTestId('tag-filter');
    expect(tagFilter).toBeInTheDocument();
    
    // Project should be visible (no filter applied)
    expect(screen.getByTestId('project-project1')).toBeInTheDocument();
  });

  it('maintains filter state across multiple tag selections', () => {
    render(<HomeClient projects={mockProjects} tags={mockTags} />);
    
    const tagFilter = screen.getByTestId('tag-filter');
    
    // Select mechanical
    fireEvent.click(within(tagFilter).getByRole('button', { name: 'mechanical' }));
    expect(screen.getByTestId('project-robot-arm')).toBeInTheDocument();
    expect(screen.queryByTestId('project-fluid-sim')).not.toBeInTheDocument();
    
    // Select simulation
    fireEvent.click(within(tagFilter).getByRole('button', { name: 'simulation' }));
    expect(screen.queryByTestId('project-robot-arm')).not.toBeInTheDocument();
    expect(screen.getByTestId('project-fluid-sim')).toBeInTheDocument();
    
    // Clear filter
    fireEvent.click(within(tagFilter).getByRole('button', { name: 'All' }));
    expect(screen.getByTestId('project-robot-arm')).toBeInTheDocument();
    expect(screen.getByTestId('project-fluid-sim')).toBeInTheDocument();
    expect(screen.getByTestId('project-drone')).toBeInTheDocument();
  });
});
