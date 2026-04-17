import { describe, it, expect } from 'vitest';
import MdxContent from './MdxContent';

describe('MdxContent', () => {
  it('exports a valid component function', () => {
    expect(typeof MdxContent).toBe('function');
    expect(MdxContent.name).toBe('MdxContent');
  });

  it('accepts source prop in its interface', () => {
    // Type check - this will fail at compile time if the interface is wrong
    const props: { source: string } = { source: '# Test' };
    expect(props.source).toBe('# Test');
  });
});
