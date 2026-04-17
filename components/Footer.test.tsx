import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { siteConfig } from '@/config/site';

describe('Footer', () => {
  it('displays copyright information with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  it('displays engineer name from site config', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(siteConfig.engineerName))).toBeInTheDocument();
  });

  it('displays contact email when available', () => {
    render(<Footer />);
    if (siteConfig.contact?.email) {
      const emailLink = screen.getByText(siteConfig.contact.email);
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('href', `mailto:${siteConfig.contact.email}`);
    }
  });

  it('uses neutral background color matching header', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-neutral-50');
  });

  it('applies 2rem vertical padding', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    const innerDiv = footer?.querySelector('div');
    expect(innerDiv).toHaveClass('py-8');
  });

  it('uses body text sizing for content', () => {
    const { container } = render(<Footer />);
    const text = container.querySelector('p');
    expect(text).toHaveClass('text-base');
  });

  it('centers content with flex layout', () => {
    const { container } = render(<Footer />);
    const contentDiv = container.querySelector('footer > div > div');
    expect(contentDiv).toHaveClass('flex');
    expect(contentDiv).toHaveClass('items-center');
  });

  it('does not display any emojis', () => {
    const { container } = render(<Footer />);
    const text = container.textContent || '';
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(text).not.toMatch(emojiRegex);
  });

  it('has proper border styling', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('border-t');
    expect(footer).toHaveClass('border-neutral-200');
  });

  it('applies hover transition to email link', () => {
    render(<Footer />);
    if (siteConfig.contact?.email) {
      const emailLink = screen.getByText(siteConfig.contact.email);
      expect(emailLink).toHaveClass('transition-colors');
      expect(emailLink).toHaveClass('duration-200');
    }
  });
});
