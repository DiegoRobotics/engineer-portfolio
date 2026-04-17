import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ImageGallery from './ImageGallery';

// Unit tests for ImageGallery component
describe('ImageGallery - Unit Tests', () => {
  it('renders all images with correct src attributes', () => {
    const images = ['/images/img1.jpg', '/images/img2.jpg', '/images/img3.jpg'];
    const { container } = render(<ImageGallery images={images} alt="Test Project" />);
    
    const imgElements = container.querySelectorAll('img');
    expect(imgElements).toHaveLength(3);
    
    imgElements.forEach((img, index) => {
      expect(img).toHaveAttribute('src', images[index]);
    });
  });

  it('renders images with correct alt text including index', () => {
    const images = ['/images/img1.jpg', '/images/img2.jpg'];
    const { container } = render(<ImageGallery images={images} alt="Robot Arm" />);
    
    const imgElements = container.querySelectorAll('img');
    expect(imgElements[0]).toHaveAttribute('alt', 'Robot Arm - Image 1');
    expect(imgElements[1]).toHaveAttribute('alt', 'Robot Arm - Image 2');
  });

  it('returns null when images array is empty', () => {
    const { container } = render(<ImageGallery images={[]} alt="Test" />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when images prop is undefined', () => {
    const { container } = render(<ImageGallery images={undefined as any} alt="Test" />);
    expect(container.firstChild).toBeNull();
  });

  it('applies horizontal scroll container classes', () => {
    const images = ['/images/img1.jpg', '/images/img2.jpg'];
    const { container } = render(<ImageGallery images={images} alt="Test" />);
    
    const scrollContainer = container.querySelector('.overflow-x-auto');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('w-full');
  });

  it('applies flex layout to image container', () => {
    const images = ['/images/img1.jpg'];
    const { container } = render(<ImageGallery images={images} alt="Test" />);
    
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).toBeInTheDocument();
    expect(flexContainer).toHaveClass('gap-4', 'pb-4');
  });

  it('applies consistent sizing to all images', () => {
    const images = ['/images/img1.jpg', '/images/img2.jpg', '/images/img3.jpg'];
    const { container } = render(<ImageGallery images={images} alt="Test" />);
    
    const imageWrappers = container.querySelectorAll('.flex-shrink-0');
    expect(imageWrappers).toHaveLength(3);
    
    imageWrappers.forEach((wrapper) => {
      expect(wrapper).toHaveClass('w-80', 'h-60', 'overflow-hidden', 'rounded-lg');
    });
  });

  it('images maintain aspect ratio with object-cover', () => {
    const images = ['/images/img1.jpg'];
    const { container } = render(<ImageGallery images={images} alt="Test" />);
    
    const img = container.querySelector('img');
    expect(img).toHaveClass('h-full', 'w-full', 'object-cover');
  });

  it('handles single image correctly', () => {
    const images = ['/images/single.jpg'];
    const { container } = render(<ImageGallery images={images} alt="Single Image" />);
    
    const imgElements = container.querySelectorAll('img');
    expect(imgElements).toHaveLength(1);
    expect(imgElements[0]).toHaveAttribute('src', '/images/single.jpg');
    expect(imgElements[0]).toHaveAttribute('alt', 'Single Image - Image 1');
  });

  it('handles many images correctly', () => {
    const images = Array.from({ length: 10 }, (_, i) => `/images/img${i}.jpg`);
    const { container } = render(<ImageGallery images={images} alt="Many Images" />);
    
    const imgElements = container.querySelectorAll('img');
    expect(imgElements).toHaveLength(10);
  });
});
