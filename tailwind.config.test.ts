import { describe, it, expect } from 'vitest';
import config from './tailwind.config';

describe('Tailwind Configuration - Spacing and Layout System', () => {
  it('should define spacing scale using 0.5rem (8px) base unit', () => {
    const spacing = config.theme?.extend?.spacing;
    expect(spacing).toBeDefined();
    expect(spacing?.['2']).toBe('0.5rem'); // 8px base unit
    expect(spacing?.['4']).toBe('1rem');   // 16px
    expect(spacing?.['8']).toBe('2rem');   // 32px
    expect(spacing?.['12']).toBe('3rem');  // 48px
    expect(spacing?.['16']).toBe('4rem');  // 64px
    expect(spacing?.['20']).toBe('5rem');  // 80px
    expect(spacing?.['24']).toBe('6rem');  // 96px
  });

  it('should configure responsive breakpoints', () => {
    const screens = config.theme?.extend?.screens;
    expect(screens).toBeDefined();
    expect(screens?.sm).toBe('640px');
    expect(screens?.md).toBe('768px');
    expect(screens?.lg).toBe('1024px');
    expect(screens?.xl).toBe('1280px');
  });

  it('should set container max-widths', () => {
    const maxWidth = config.theme?.extend?.maxWidth;
    expect(maxWidth).toBeDefined();
    expect(maxWidth?.container).toBe('1280px');
    expect(maxWidth?.reading).toBe('800px');
  });

  it('should configure container with proper padding', () => {
    const container = config.theme?.extend?.container;
    expect(container).toBeDefined();
    expect(container?.center).toBe(true);
    expect(container?.padding?.DEFAULT).toBe('1.5rem');
    expect(container?.padding?.sm).toBe('2rem');
    expect(container?.padding?.lg).toBe('3rem');
  });

  it('should cap container at 1280px on all screen sizes', () => {
    const container = config.theme?.extend?.container;
    expect(container?.screens?.xl).toBe('1280px');
    expect(container?.screens?.['2xl']).toBe('1280px');
  });
});
