import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';
import * as fc from 'fast-check';
import type { ProjectMeta } from '@/lib/projects';

// Unit tests for ProjectCard component
describe('ProjectCard - Unit Tests', () => {
  it('renders the project title correctly', () => {
    render(<ProjectCard slug="test-project" title="My Test Project" />);
    
    const titleElement = screen.getByRole('heading', { level: 3 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('My Test Project');
  });

  it('renders thumbnail image when thumbnail prop is provided', () => {
    const { container } = render(
      <ProjectCard 
        slug="test-project" 
        title="My Test Project" 
        thumbnail="/images/test-thumbnail.jpg" 
      />
    );
    
    const imgElement = container.querySelector('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', '/images/test-thumbnail.jpg');
    expect(imgElement).toHaveAttribute('alt', 'My Test Project');
    
    // Verify no SVG placeholder is rendered
    const svgElement = container.querySelector('svg');
    expect(svgElement).not.toBeInTheDocument();
  });

  it('renders placeholder SVG when thumbnail prop is undefined', () => {
    const { container } = render(
      <ProjectCard slug="test-project" title="My Test Project" />
    );
    
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('fill', 'none');
    expect(svgElement).toHaveAttribute('stroke', 'currentColor');
    
    // Verify no img element is rendered
    const imgElement = container.querySelector('img');
    expect(imgElement).not.toBeInTheDocument();
  });

  it('link wraps the card and points to correct slug', () => {
    const { container } = render(
      <ProjectCard slug="my-robot-arm" title="Robot Arm Project" />
    );
    
    const linkElement = container.querySelector('a');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/projects/my-robot-arm');
  });

  it('link has correct href attribute for different slugs', () => {
    const { container: container1 } = render(
      <ProjectCard slug="fluid-simulator" title="Fluid Simulator" />
    );
    const link1 = container1.querySelector('a');
    expect(link1).toHaveAttribute('href', '/projects/fluid-simulator');

    const { container: container2 } = render(
      <ProjectCard slug="another-project" title="Another Project" />
    );
    const link2 = container2.querySelector('a');
    expect(link2).toHaveAttribute('href', '/projects/another-project');
  });

  it('card has proper styling classes', () => {
    const { container } = render(
      <ProjectCard slug="test-project" title="Test Project" />
    );
    
    const linkElement = container.querySelector('a');
    expect(linkElement).toHaveClass('group', 'block', 'overflow-hidden', 'rounded-lg');
    expect(linkElement).toHaveClass('border', 'border-gray-200', 'bg-white', 'shadow-sm');
  });

  it('hover effects are applied via CSS classes', () => {
    const { container } = render(
      <ProjectCard slug="test-project" title="Test Project" thumbnail="/images/test.jpg" />
    );
    
    const linkElement = container.querySelector('a');
    expect(linkElement).toHaveClass('hover:shadow-md', 'hover:border-gray-300');
    
    const titleElement = container.querySelector('h3');
    expect(titleElement).toHaveClass('group-hover:text-gray-700');
    
    const imgElement = container.querySelector('img');
    expect(imgElement).toHaveClass('group-hover:scale-105');
  });
});

// Feature: engineer-portfolio, Property 5: Project card renders title and thumbnail
describe('Property 5: Project card renders title and thumbnail', () => {
  it('should render title text and img element with matching src when thumbnail is defined', () => {
    // Generator for valid ProjectMeta objects
    const projectMetaArbitrary = fc.record({
      slug: fc.string({ minLength: 1, maxLength: 50 })
        .filter(s => s.trim().length > 0 && /^[a-z0-9-]+$/.test(s)),
      title: fc.string({ minLength: 1, maxLength: 100 })
        .filter(s => s.trim().length > 0),
      description: fc.string({ minLength: 1, maxLength: 500 })
        .filter(s => s.trim().length > 0),
      date: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
        .map(date => date.toISOString().split('T')[0]),
      status: fc.constantFrom('In Progress', 'Completed', 'Archived', 'On Hold'),
      tags: fc.array(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
        { maxLength: 10 }
      ),
      thumbnail: fc.option(
        fc.string({ minLength: 1, maxLength: 100 })
          .filter(s => s.trim().length > 0)
          .map(s => `/images/${s.trim()}.jpg`),
        { nil: undefined }
      )
    });

    fc.assert(
      fc.property(projectMetaArbitrary, (projectMeta: ProjectMeta) => {
        // Render the ProjectCard component in an isolated container
        const { container } = render(
          <ProjectCard
            slug={projectMeta.slug}
            title={projectMeta.title}
            thumbnail={projectMeta.thumbnail}
          />
        );

        // Assert that the title text is present in the rendered output
        // Use container.textContent to check for title presence
        expect(container.textContent).toContain(projectMeta.title);
        
        // Verify the title is in an h3 element
        const h3Element = container.querySelector('h3');
        expect(h3Element).toBeInTheDocument();
        expect(h3Element?.textContent).toBe(projectMeta.title);

        // When thumbnail is defined, assert that an img element exists with matching src
        if (projectMeta.thumbnail) {
          const imgElement = container.querySelector('img');
          expect(imgElement).toBeInTheDocument();
          expect(imgElement?.getAttribute('src')).toBe(projectMeta.thumbnail);
          
          // Verify no SVG placeholder is rendered when thumbnail exists
          const svgElement = container.querySelector('svg');
          expect(svgElement).not.toBeInTheDocument();
        } else {
          // When thumbnail is undefined, verify placeholder is rendered instead
          // The placeholder is an SVG element
          const svgElement = container.querySelector('svg');
          expect(svgElement).toBeInTheDocument();
          
          // Verify no img element is rendered when thumbnail is undefined
          const imgElement = container.querySelector('img');
          expect(imgElement).not.toBeInTheDocument();
        }

        return true; // Property holds
      }),
      { numRuns: 100 } // Minimum 100 iterations as specified in design
    );
  });
});
