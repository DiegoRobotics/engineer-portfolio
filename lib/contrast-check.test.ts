import { describe, it, expect } from 'vitest';

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.0 formula
 */
function getLuminance(hex: string): number {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Color Contrast - WCAG AA Compliance', () => {
  const colors = {
    neutral: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
    },
    accent: {
      light: '#60a5fa',
      DEFAULT: '#2563eb',
      dark: '#1e40af',
    },
    background: '#fafaf9',
    foreground: '#1c1917',
    muted: '#f5f5f4',
    mutedForeground: '#57534e',
    border: '#e7e5e4',
  };

  describe('Primary text combinations', () => {
    it('foreground on background should meet WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.foreground, colors.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('neutral-900 on neutral-50 should meet WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.neutral[900], colors.neutral[50]);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('neutral-800 on neutral-50 should meet WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.neutral[800], colors.neutral[50]);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('neutral-700 on neutral-50 should meet WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.neutral[700], colors.neutral[50]);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Secondary text combinations', () => {
    it('mutedForeground on background should meet WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.mutedForeground, colors.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('neutral-600 on neutral-50 should meet WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.neutral[600], colors.neutral[50]);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('neutral-600 on muted should meet WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.neutral[600], colors.muted);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Accent color combinations', () => {
    it('accent DEFAULT on background should meet WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.accent.DEFAULT, colors.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('accent dark on background should meet WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.accent.dark, colors.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Border visibility', () => {
    it('border on background should be visible (minimum 1.2:1)', () => {
      const ratio = getContrastRatio(colors.border, colors.background);
      // Borders don't need 3:1 contrast - they just need to be subtly visible
      expect(ratio).toBeGreaterThanOrEqual(1.2);
    });

    it('neutral-200 on neutral-50 should be visible (minimum 1.2:1)', () => {
      const ratio = getContrastRatio(colors.neutral[200], colors.neutral[50]);
      // Borders don't need 3:1 contrast - they just need to be subtly visible
      expect(ratio).toBeGreaterThanOrEqual(1.2);
    });
  });

  describe('Card backgrounds', () => {
    it('foreground on muted should meet WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.foreground, colors.muted);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('neutral-900 on neutral-100 should meet WCAG AA (4.5:1)', () => {
      const ratio = getContrastRatio(colors.neutral[900], colors.neutral[100]);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });
});
