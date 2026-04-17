import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TagFilter from './TagFilter';

describe('TagFilter', () => {
  it('renders all tags and an "All" button', () => {
    const tags = ['software', 'mechanical', 'simulation'];
    const onChange = vi.fn();

    render(<TagFilter tags={tags} activeTag={null} onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'software' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'mechanical' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'simulation' })).toBeInTheDocument();
  });

  it('highlights the "All" button when activeTag is null', () => {
    const tags = ['software', 'mechanical'];
    const onChange = vi.fn();

    render(<TagFilter tags={tags} activeTag={null} onChange={onChange} />);

    const allButton = screen.getByRole('button', { name: 'All' });
    expect(allButton).toHaveAttribute('aria-pressed', 'true');
    expect(allButton).toHaveClass('bg-gray-900', 'text-white');
  });

  it('highlights the active tag button', () => {
    const tags = ['software', 'mechanical', 'simulation'];
    const onChange = vi.fn();

    render(<TagFilter tags={tags} activeTag="mechanical" onChange={onChange} />);

    const mechanicalButton = screen.getByRole('button', { name: 'mechanical' });
    expect(mechanicalButton).toHaveAttribute('aria-pressed', 'true');
    expect(mechanicalButton).toHaveClass('bg-gray-900', 'text-white');

    const softwareButton = screen.getByRole('button', { name: 'software' });
    expect(softwareButton).toHaveAttribute('aria-pressed', 'false');
    expect(softwareButton).toHaveClass('bg-gray-100', 'text-gray-700');
  });

  it('calls onChange with the selected tag when a tag button is clicked', () => {
    const tags = ['software', 'mechanical'];
    const onChange = vi.fn();

    render(<TagFilter tags={tags} activeTag={null} onChange={onChange} />);

    const softwareButton = screen.getByRole('button', { name: 'software' });
    fireEvent.click(softwareButton);

    expect(onChange).toHaveBeenCalledWith('software');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange with null when the "All" button is clicked', () => {
    const tags = ['software', 'mechanical'];
    const onChange = vi.fn();

    render(<TagFilter tags={tags} activeTag="software" onChange={onChange} />);

    const allButton = screen.getByRole('button', { name: 'All' });
    fireEvent.click(allButton);

    expect(onChange).toHaveBeenCalledWith(null);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders correctly with an empty tags array', () => {
    const onChange = vi.fn();

    render(<TagFilter tags={[]} activeTag={null} onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('applies correct styling classes to inactive buttons', () => {
    const tags = ['software', 'mechanical'];
    const onChange = vi.fn();

    render(<TagFilter tags={tags} activeTag="software" onChange={onChange} />);

    const mechanicalButton = screen.getByRole('button', { name: 'mechanical' });
    expect(mechanicalButton).toHaveClass('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
    expect(mechanicalButton).not.toHaveClass('bg-gray-900', 'text-white');

    const allButton = screen.getByRole('button', { name: 'All' });
    expect(allButton).toHaveClass('bg-gray-100', 'text-gray-700', 'hover:bg-gray-200');
    expect(allButton).not.toHaveClass('bg-gray-900', 'text-white');
  });

  it('applies correct styling classes to active buttons', () => {
    const tags = ['software', 'mechanical'];
    const onChange = vi.fn();

    render(<TagFilter tags={tags} activeTag="software" onChange={onChange} />);

    const softwareButton = screen.getByRole('button', { name: 'software' });
    expect(softwareButton).toHaveClass('bg-gray-900', 'text-white', 'shadow-md');
    expect(softwareButton).not.toHaveClass('bg-gray-100', 'text-gray-700');
  });

  it('calls onChange when clicking an already active tag', () => {
    const tags = ['software', 'mechanical'];
    const onChange = vi.fn();

    render(<TagFilter tags={tags} activeTag="software" onChange={onChange} />);

    const softwareButton = screen.getByRole('button', { name: 'software' });
    fireEvent.click(softwareButton);

    expect(onChange).toHaveBeenCalledWith('software');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders multiple tags with correct aria-pressed attributes', () => {
    const tags = ['software', 'mechanical', 'simulation', 'hardware'];
    const onChange = vi.fn();

    render(<TagFilter tags={tags} activeTag="simulation" onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'software' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'mechanical' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'simulation' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'hardware' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies transition-all class to all buttons for smooth animations', () => {
    const tags = ['software'];
    const onChange = vi.fn();

    render(<TagFilter tags={tags} activeTag={null} onChange={onChange} />);

    const allButton = screen.getByRole('button', { name: 'All' });
    const softwareButton = screen.getByRole('button', { name: 'software' });

    expect(allButton).toHaveClass('transition-all');
    expect(softwareButton).toHaveClass('transition-all');
  });
});
