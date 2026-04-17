import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectsPage from './page';
import * as projectsLib from '@/lib/projects';

// Mock the projects library
vi.mock('@/lib/projects', () => ({
  getAllProjects: vi.fn(),
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('ProjectsPage', () => {
  it('renders page title', async () => {
    vi.mocked(projectsLib.getAllProjects).mockResolvedValue([]);
    
    const page = await ProjectsPage();
    render(page);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('All Projects');
  });

  it('displays message when no projects exist', async () => {
    vi.mocked(projectsLib.getAllProjects).mockResolvedValue([]);
    
    const page = await ProjectsPage();
    render(page);
    
    expect(screen.getByText('No projects found')).toBeInTheDocument();
  });

  it('sorts projects alphabetically by title', async () => {
    const mockProjects = [
      {
        slug: 'zebra-project',
        title: 'Zebra Project',
        description: 'Last alphabetically',
        date: '2024-01-01',
        status: 'completed',
        tags: [],
      },
      {
        slug: 'alpha-project',
        title: 'Alpha Project',
        description: 'First alphabetically',
        date: '2024-01-02',
        status: 'completed',
        tags: [],
      },
      {
        slug: 'middle-project',
        title: 'Middle Project',
        description: 'Middle alphabetically',
        date: '2024-01-03',
        status: 'completed',
        tags: [],
      },
    ];
    
    vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
    
    const page = await ProjectsPage();
    render(page);
    
    const projectTitles = screen.getAllByRole('heading', { level: 3 });
    expect(projectTitles[0]).toHaveTextContent('Alpha Project');
    expect(projectTitles[1]).toHaveTextContent('Middle Project');
    expect(projectTitles[2]).toHaveTextContent('Zebra Project');
  });

  it('renders all projects with ProjectButton components', async () => {
    const mockProjects = [
      {
        slug: 'project-1',
        title: 'Project One',
        description: 'Description one',
        date: '2024-01-01',
        status: 'completed',
        tags: [],
      },
      {
        slug: 'project-2',
        title: 'Project Two',
        description: 'Description two',
        date: '2024-01-02',
        status: 'in-progress',
        tags: [],
      },
    ];
    
    vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
    
    const page = await ProjectsPage();
    render(page);
    
    expect(screen.getByText('Project One')).toBeInTheDocument();
    expect(screen.getByText('Project Two')).toBeInTheDocument();
  });

  it('uses single column layout with proper spacing', async () => {
    const mockProjects = [
      {
        slug: 'project-1',
        title: 'Project One',
        description: 'Description',
        date: '2024-01-01',
        status: 'completed',
        tags: [],
      },
    ];
    
    vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
    
    const page = await ProjectsPage();
    const { container } = render(page);
    
    // Check for flex column layout with gap
    const projectList = container.querySelector('.flex.flex-col.gap-4');
    expect(projectList).toBeInTheDocument();
  });

  it('links to correct project detail pages', async () => {
    const mockProjects = [
      {
        slug: 'test-project',
        title: 'Test Project',
        description: 'Test description',
        date: '2024-01-01',
        status: 'completed',
        tags: [],
      },
    ];
    
    vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
    
    const page = await ProjectsPage();
    render(page);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/projects/test-project');
  });

  describe('Alphabetical Sorting (Requirement 11.1)', () => {
    it('sorts projects alphabetically by title', async () => {
      const mockProjects = [
        {
          slug: 'zebra-project',
          title: 'Zebra Project',
          description: 'Last alphabetically',
          date: '2024-01-01',
          status: 'completed',
          tags: [],
        },
        {
          slug: 'alpha-project',
          title: 'Alpha Project',
          description: 'First alphabetically',
          date: '2024-01-02',
          status: 'completed',
          tags: [],
        },
        {
          slug: 'middle-project',
          title: 'Middle Project',
          description: 'Middle alphabetically',
          date: '2024-01-03',
          status: 'completed',
          tags: [],
        },
      ];
      
      vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
      
      const page = await ProjectsPage();
      render(page);
      
      const projectTitles = screen.getAllByRole('heading', { level: 3 });
      expect(projectTitles[0]).toHaveTextContent('Alpha Project');
      expect(projectTitles[1]).toHaveTextContent('Middle Project');
      expect(projectTitles[2]).toHaveTextContent('Zebra Project');
    });

    it('sorts case-insensitively', async () => {
      const mockProjects = [
        {
          slug: 'lowercase',
          title: 'zebra project',
          description: 'Lowercase z',
          date: '2024-01-01',
          status: 'completed',
          tags: [],
        },
        {
          slug: 'uppercase',
          title: 'Alpha Project',
          description: 'Uppercase A',
          date: '2024-01-02',
          status: 'completed',
          tags: [],
        },
      ];
      
      vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
      
      const page = await ProjectsPage();
      render(page);
      
      const projectTitles = screen.getAllByRole('heading', { level: 3 });
      expect(projectTitles[0]).toHaveTextContent('Alpha Project');
      expect(projectTitles[1]).toHaveTextContent('zebra project');
    });

    it('handles special characters in alphabetical sorting', async () => {
      const mockProjects = [
        {
          slug: 'special',
          title: '3D Printer Project',
          description: 'Starts with number',
          date: '2024-01-01',
          status: 'completed',
          tags: [],
        },
        {
          slug: 'normal',
          title: 'Advanced Robotics',
          description: 'Starts with letter',
          date: '2024-01-02',
          status: 'completed',
          tags: [],
        },
      ];
      
      vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
      
      const page = await ProjectsPage();
      render(page);
      
      const projectTitles = screen.getAllByRole('heading', { level: 3 });
      // Numbers come before letters in localeCompare
      expect(projectTitles[0]).toHaveTextContent('3D Printer Project');
      expect(projectTitles[1]).toHaveTextContent('Advanced Robotics');
    });

    it('maintains original array and creates sorted copy', async () => {
      const mockProjects = [
        {
          slug: 'b-project',
          title: 'B Project',
          description: 'Second',
          date: '2024-01-01',
          status: 'completed',
          tags: [],
        },
        {
          slug: 'a-project',
          title: 'A Project',
          description: 'First',
          date: '2024-01-02',
          status: 'completed',
          tags: [],
        },
      ];
      
      const originalOrder = [...mockProjects];
      vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
      
      const page = await ProjectsPage();
      render(page);
      
      // Verify original array wasn't mutated
      expect(mockProjects[0].title).toBe(originalOrder[0].title);
      expect(mockProjects[1].title).toBe(originalOrder[1].title);
    });
  });

  describe('Responsive Layout (Requirement 11.2)', () => {
    let originalInnerWidth: number;

    beforeEach(() => {
      originalInnerWidth = window.innerWidth;
    });

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
    });

    it('uses single column layout on mobile (< 640px)', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const mockProjects = [
        {
          slug: 'project-1',
          title: 'Project One',
          description: 'Description',
          date: '2024-01-01',
          status: 'completed',
          tags: [],
        },
      ];
      
      vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
      
      const page = await ProjectsPage();
      const { container } = render(page);
      
      // Verify flex-col (single column) layout
      const projectList = container.querySelector('.flex.flex-col');
      expect(projectList).toBeInTheDocument();
    });

    it('applies mobile padding (px-6) at small viewports', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      vi.mocked(projectsLib.getAllProjects).mockResolvedValue([]);
      
      const page = await ProjectsPage();
      const { container } = render(page);
      
      const mainContainer = container.querySelector('.container');
      expect(mainContainer).toHaveClass('px-6');
    });

    it('applies desktop padding (lg:px-12) at large viewports', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      });

      vi.mocked(projectsLib.getAllProjects).mockResolvedValue([]);
      
      const page = await ProjectsPage();
      const { container } = render(page);
      
      const mainContainer = container.querySelector('.container');
      expect(mainContainer).toHaveClass('lg:px-12');
    });

    it('maintains consistent gap spacing between project buttons', async () => {
      const mockProjects = [
        {
          slug: 'project-1',
          title: 'Project One',
          description: 'Description',
          date: '2024-01-01',
          status: 'completed',
          tags: [],
        },
        {
          slug: 'project-2',
          title: 'Project Two',
          description: 'Description',
          date: '2024-01-02',
          status: 'completed',
          tags: [],
        },
      ];
      
      vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
      
      const page = await ProjectsPage();
      const { container } = render(page);
      
      // Verify gap-4 (1rem) spacing between buttons
      const projectList = container.querySelector('.gap-4');
      expect(projectList).toBeInTheDocument();
    });

    it('constrains content width to max-w-4xl for readability', async () => {
      const mockProjects = [
        {
          slug: 'project-1',
          title: 'Project One',
          description: 'Description',
          date: '2024-01-01',
          status: 'completed',
          tags: [],
        },
      ];
      
      vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
      
      const page = await ProjectsPage();
      const { container } = render(page);
      
      // Verify max-w-4xl constraint
      const projectList = container.querySelector('.max-w-4xl');
      expect(projectList).toBeInTheDocument();
    });

    it('applies responsive vertical spacing (py-8 mobile, lg:py-12 desktop)', async () => {
      vi.mocked(projectsLib.getAllProjects).mockResolvedValue([]);
      
      const page = await ProjectsPage();
      const { container } = render(page);
      
      const mainContainer = container.querySelector('.container');
      expect(mainContainer).toHaveClass('py-8');
      expect(mainContainer).toHaveClass('lg:py-12');
    });
  });

  describe('Project Display (Requirement 11.2)', () => {
    it('uses ProjectButton components for each project', async () => {
      const mockProjects = [
        {
          slug: 'project-1',
          title: 'Project One',
          description: 'Description one',
          date: '2024-01-01',
          status: 'completed',
          tags: [],
        },
        {
          slug: 'project-2',
          title: 'Project Two',
          description: 'Description two',
          date: '2024-01-02',
          status: 'completed',
          tags: [],
        },
      ];
      
      vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
      
      const page = await ProjectsPage();
      render(page);
      
      // Verify both projects are rendered
      expect(screen.getByText('Project One')).toBeInTheDocument();
      expect(screen.getByText('Project Two')).toBeInTheDocument();
      
      // Verify they are rendered as headings (ProjectButton uses h3)
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(2);
    });

    it('makes project titles prominent with large buttons', async () => {
      const mockProjects = [
        {
          slug: 'project-1',
          title: 'Prominent Project',
          description: 'Description',
          date: '2024-01-01',
          status: 'completed',
          tags: [],
        },
      ];
      
      vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
      
      const page = await ProjectsPage();
      render(page);
      
      const heading = screen.getByRole('heading', { level: 3 });
      // Verify title uses large font size for prominence
      expect(heading).toHaveClass('text-2xl');
      expect(heading).toHaveClass('font-serif');
    });

    it('optimizes for easy scrolling with consistent spacing', async () => {
      const mockProjects = Array.from({ length: 10 }, (_, i) => ({
        slug: `project-${i}`,
        title: `Project ${String.fromCharCode(65 + i)}`,
        description: `Description ${i}`,
        date: '2024-01-01',
        status: 'completed',
        tags: [],
      }));
      
      vi.mocked(projectsLib.getAllProjects).mockResolvedValue(mockProjects);
      
      const page = await ProjectsPage();
      const { container } = render(page);
      
      // Verify consistent gap spacing for smooth scrolling
      const projectList = container.querySelector('.flex.flex-col.gap-4');
      expect(projectList).toBeInTheDocument();
      
      // Verify all projects are rendered
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(10);
    });
  });
});
