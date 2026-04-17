import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectButton from './ProjectButton';

describe('ProjectButton', () => {
  it('renders project title prominently', () => {
    render(<ProjectButton slug="test-project" title="Test Project" />);
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Test Project');
  });

  it('links to the correct project detail page', () => {
    render(<ProjectButton slug="my-project" title="My Project" />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/projects/my-project');
  });

  it('applies serif font and semibold weight to title', () => {
    render(<ProjectButton slug="test" title="Test Title" />);
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveClass('font-serif');
    expect(heading).toHaveClass('font-semibold');
  });

  it('applies correct padding classes', () => {
    const { container } = render(<ProjectButton slug="test" title="Test" />);
    
    const button = container.querySelector('div');
    expect(button).toHaveClass('p-6');
    expect(button).toHaveClass('lg:p-8');
  });

  it('applies border, border-radius, and shadow', () => {
    const { container } = render(<ProjectButton slug="test" title="Test" />);
    
    const button = container.querySelector('div');
    expect(button).toHaveClass('border');
    expect(button).toHaveClass('border-neutral-200');
    expect(button).toHaveClass('rounded-lg');
    expect(button).toHaveClass('shadow-sm');
  });

  it('applies hover state classes with scale and shadow', () => {
    const { container } = render(<ProjectButton slug="test" title="Test" />);
    
    const button = container.querySelector('div');
    expect(button).toHaveClass('hover:scale-[1.02]');
    expect(button).toHaveClass('hover:shadow-md');
    expect(button).toHaveClass('hover:border-accent');
  });

  it('applies 200ms transition duration', () => {
    const { container } = render(<ProjectButton slug="test" title="Test" />);
    
    const button = container.querySelector('div');
    expect(button).toHaveClass('duration-200');
  });

  it('applies responsive font sizes (1.5rem mobile, 1.875rem desktop)', () => {
    render(<ProjectButton slug="test" title="Test" />);
    
    const heading = screen.getByRole('heading', { level: 3 });
    // text-2xl = 1.5rem (24px), lg:text-section = 1.875rem (30px)
    expect(heading).toHaveClass('text-2xl');
    expect(heading).toHaveClass('lg:text-section');
  });

  it('does not render description by default', () => {
    render(
      <ProjectButton 
        slug="test" 
        title="Test" 
        description="This is a description" 
      />
    );
    
    expect(screen.queryByText('This is a description')).not.toBeInTheDocument();
  });

  it('renders description when showDescription is true', () => {
    render(
      <ProjectButton 
        slug="test" 
        title="Test" 
        description="This is a description"
        showDescription={true}
      />
    );
    
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('does not render description paragraph when description is undefined', () => {
    const { container } = render(
      <ProjectButton 
        slug="test" 
        title="Test" 
        showDescription={true}
      />
    );
    
    const paragraph = container.querySelector('p');
    expect(paragraph).not.toBeInTheDocument();
  });

  it('makes title the most prominent visual element', () => {
    render(<ProjectButton slug="test" title="Prominent Title" />);
    
    const heading = screen.getByRole('heading', { level: 3 });
    // Verify large font size and dark color for prominence
    expect(heading).toHaveClass('text-2xl');
    expect(heading).toHaveClass('text-neutral-800');
  });

  describe('Responsive Layout (Requirement 5.4)', () => {
    let originalInnerWidth: number;

    beforeEach(() => {
      originalInnerWidth = window.innerWidth;
    });

    afterEach(() => {
      // Restore original window size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: originalInnerWidth,
      });
    });

    it('applies mobile padding (p-6) at small viewports', () => {
      // Simulate mobile viewport (< 640px)
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const button = container.querySelector('div');
      
      // Mobile uses p-6 (1.5rem padding)
      expect(button).toHaveClass('p-6');
    });

    it('applies desktop padding (lg:p-8) at large viewports', () => {
      // Simulate desktop viewport (>= 1024px)
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      });

      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const button = container.querySelector('div');
      
      // Desktop uses lg:p-8 (2rem padding)
      expect(button).toHaveClass('lg:p-8');
    });

    it('applies mobile font size (text-2xl) at small viewports', () => {
      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<ProjectButton slug="test" title="Test" />);
      const heading = screen.getByRole('heading', { level: 3 });
      
      // Mobile uses text-2xl (1.5rem / 24px)
      expect(heading).toHaveClass('text-2xl');
    });

    it('applies desktop font size (lg:text-section) at large viewports', () => {
      // Simulate desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      });

      render(<ProjectButton slug="test" title="Test" />);
      const heading = screen.getByRole('heading', { level: 3 });
      
      // Desktop uses lg:text-section (1.875rem / 30px)
      expect(heading).toHaveClass('lg:text-section');
    });

    it('maintains at least 1.5rem padding on mobile (Requirement 5.2)', () => {
      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const button = container.querySelector('div');
      
      // p-6 = 1.5rem, which meets the requirement
      expect(button).toHaveClass('p-6');
    });

    it('maintains at least 2rem padding on desktop (Requirement 5.2)', () => {
      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const button = container.querySelector('div');
      
      // lg:p-8 = 2rem, which meets the requirement
      expect(button).toHaveClass('lg:p-8');
    });
  });

  describe('Hover States (Requirement 5.4)', () => {
    it('applies hover scale transformation', () => {
      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const button = container.querySelector('div');
      
      // Verify hover:scale-[1.02] class is present
      expect(button).toHaveClass('hover:scale-[1.02]');
    });

    it('applies hover shadow increase', () => {
      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const button = container.querySelector('div');
      
      // Verify shadow changes from shadow-sm to hover:shadow-md
      expect(button).toHaveClass('shadow-sm');
      expect(button).toHaveClass('hover:shadow-md');
    });

    it('applies hover border color change to accent', () => {
      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const button = container.querySelector('div');
      
      // Verify border changes to accent color on hover
      expect(button).toHaveClass('border-neutral-200');
      expect(button).toHaveClass('hover:border-accent');
    });

    it('completes hover transition within 200ms (Requirement 5.4)', () => {
      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const button = container.querySelector('div');
      
      // Verify transition duration is 200ms
      expect(button).toHaveClass('duration-200');
    });

    it('uses ease-out timing function for smooth transitions', () => {
      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const button = container.querySelector('div');
      
      // Verify ease-out timing function
      expect(button).toHaveClass('ease-out');
    });

    it('maintains interactive state on mouse enter and leave', () => {
      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const link = container.querySelector('a');
      
      expect(link).toBeInTheDocument();
      
      // Simulate hover
      if (link) {
        fireEvent.mouseEnter(link);
        // Link should still be in document and functional
        expect(link).toBeInTheDocument();
        
        fireEvent.mouseLeave(link);
        // Link should still be in document after hover ends
        expect(link).toBeInTheDocument();
      }
    });
  });

  describe('Styling Requirements', () => {
    it('displays title at least 1.5x larger than body text (Requirement 5.1)', () => {
      render(<ProjectButton slug="test" title="Test" />);
      const heading = screen.getByRole('heading', { level: 3 });
      
      // text-2xl = 1.5rem (24px), which is 1.5x the body text size (1rem/16px)
      // lg:text-section = 1.875rem (30px), which is 1.875x the body text size
      expect(heading).toHaveClass('text-2xl');
      expect(heading).toHaveClass('lg:text-section');
    });

    it('uses subtle shadows for depth (Requirement 5.3)', () => {
      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const button = container.querySelector('div');
      
      // Verify subtle shadow is applied
      expect(button).toHaveClass('shadow-sm');
    });

    it('uses borders for visual prominence (Requirement 5.3)', () => {
      const { container } = render(<ProjectButton slug="test" title="Test" />);
      const button = container.querySelector('div');
      
      // Verify border is applied
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('border-neutral-200');
    });

    it('makes project title the most prominent element (Requirement 5.5)', () => {
      render(<ProjectButton slug="test" title="Prominent Title" />);
      const heading = screen.getByRole('heading', { level: 3 });
      
      // Verify title uses serif font, large size, and dark color for prominence
      expect(heading).toHaveClass('font-serif');
      expect(heading).toHaveClass('font-semibold');
      expect(heading).toHaveClass('text-neutral-800');
      expect(heading).toHaveClass('text-2xl');
    });
  });
});
