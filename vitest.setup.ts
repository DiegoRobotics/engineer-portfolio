import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js fonts
vi.mock('next/font/google', () => ({
  Merriweather: () => ({
    className: '__Merriweather_123456',
    variable: '--font-serif',
    style: { fontFamily: 'Merriweather, Georgia, serif' },
  }),
  Inter: () => ({
    className: '__Inter_789012',
    variable: '--font-sans',
    style: { fontFamily: 'Inter, system-ui, sans-serif' },
  }),
}));
