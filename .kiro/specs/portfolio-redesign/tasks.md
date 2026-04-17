# Implementation Plan: Portfolio Redesign

## Overview

This implementation plan transforms Diego Morales' engineering portfolio into a clean, professional, and elegant web experience. The redesign emphasizes visual hierarchy, readability, and ease of navigation through a three-page architecture with optional rich media support for project details.

**Implementation Language**: TypeScript with Next.js 14+ (App Router) and Tailwind CSS

**Key Implementation Priorities**:
1. Establish design system foundation (typography, colors, spacing)
2. Build core navigation and layout structure
3. Implement page-specific components and layouts
4. Add responsive behavior and animations
5. Integrate optional media support for project details

## Tasks

- [x] 1. Set up design system foundation
  - [x] 1.1 Configure Tailwind with typography system
    - Add Merriweather (serif) and Inter (sans-serif) font families to tailwind.config.ts
    - Define font size scale with responsive variants (hero, page-title, section, body)
    - Configure font weights (400, 500, 600, 700) and line heights (1.2-1.8)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 1.2 Configure color scheme in Tailwind
    - Define neutral color palette (50-900 shades) with warm gray tones
    - Add accent color variants (light, DEFAULT, dark) for interactive elements
    - Configure semantic colors (background, foreground, muted, border)
    - Verify all color combinations meet WCAG AA contrast ratios (4.5:1 minimum)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 1.3 Configure spacing and layout system
    - Define spacing scale using 0.5rem (8px) base unit
    - Configure responsive breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
    - Set container max-widths (1280px general, 800px reading)
    - Configure section padding and margin scales
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1_
  
  - [x] 1.4 Load Google Fonts in root layout
    - Import Merriweather (weights 400, 700) and Inter fonts from next/font/google
    - Configure font variables (--font-serif, --font-sans)
    - Apply font-sans as default body font in root layout
    - _Requirements: 1.1, 1.2_

- [x] 2. Build navigation header component
  - [x] 2.1 Create Header component with navigation links
    - Build sticky header with 64px (mobile) / 72px (desktop) height
    - Add navigation links for Home, Projects, and About pages
    - Implement active state with underline decoration (2px, offset 4px)
    - Add hover state with color transition (200ms ease)
    - Use 1.5rem spacing between navigation links
    - Ensure no emojis are displayed anywhere in the header
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 18.2_
  
  - [x] 2.2 Write unit tests for Header component
    - Test navigation links render correctly
    - Test active state applies to current page
    - Test hover state transitions
    - Test responsive behavior at different breakpoints
    - _Requirements: 8.1, 8.6_

- [x] 3. Build footer component
  - [x] 3.1 Create Footer component
    - Use neutral background color matching header
    - Display copyright and contact information with body text sizing
    - Apply 2rem vertical padding
    - Center-align or use grid layout for content
    - Ensure no emojis are displayed in footer
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 18.4_
  
  - [x] 3.2 Write unit tests for Footer component
    - Test footer renders with correct styling
    - Test copyright year displays correctly
    - Test contact information displays correctly
    - _Requirements: 9.1, 9.2_

- [x] 4. Implement root layout structure
  - [x] 4.1 Update app/layout.tsx with Header and Footer
    - Integrate Header component at top (sticky position)
    - Add main content area with proper spacing
    - Integrate Footer component at bottom
    - Apply global styles and font variables
    - Configure metadata for SEO
    - _Requirements: 8.3, 9.1_
  
  - [x] 4.2 Write integration tests for root layout
    - Test Header renders on all pages
    - Test Footer renders on all pages
    - Test main content area has correct spacing
    - _Requirements: 8.3_

- [x] 5. Checkpoint - Verify design system and layout structure
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Build landing page with hero and featured projects
  - [x] 6.1 Create landing page hero section
    - Display "Diego Morales' Engineering Projects" as main title
    - Use hero font size (2.25rem mobile, 3rem desktop) with bold weight
    - Ensure title is at least 2.5x larger than body text on desktop
    - Apply fade-in animation on page load (600ms duration)
    - Ensure no emojis in title
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 7.3, 18.1_
  
  - [x] 6.2 Create FeaturedProjectCard component
    - Display project title, description, date, status, and optional thumbnail
    - Use serif font for project title with appropriate sizing
    - Apply card styling with padding, border, and subtle shadow
    - Implement hover state with scale and shadow transition (200ms)
    - Link to project detail page using Next.js Link
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 7.2_
  
  - [x] 6.3 Implement featured projects section on landing page
    - Fetch 3-6 featured projects from content directory
    - Display projects in responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
    - Use 1.5rem gap between cards
    - Position immediately below hero title
    - Apply stagger fade-in animation (100ms delay between items)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 7.3_
  
  - [x] 6.4 Write unit tests for landing page components
    - Test hero title renders correctly
    - Test FeaturedProjectCard renders with all props
    - Test featured projects grid layout at different breakpoints
    - Test no emojis are displayed
    - _Requirements: 2.1, 2.4, 10.4_

- [x] 7. Build projects page with large project buttons
  - [x] 7.1 Create ProjectButton component
    - Display project title prominently with 1.5rem (mobile) / 1.875rem (desktop) font size
    - Use serif font for title with semibold weight
    - Apply 1.5rem vertical and 2rem horizontal padding
    - Add border, border-radius (0.5rem), and subtle shadow
    - Implement hover state with scale 1.02 and shadow increase (200ms transition)
    - Link to project detail page
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 7.2_
  
  - [x] 7.2 Create projects listing page
    - Fetch all projects from content directory
    - Sort projects alphabetically by title
    - Display projects using ProjectButton components
    - Use single column layout on mobile, 1-2 columns on tablet/desktop
    - Apply 1rem spacing between buttons
    - Optimize for easy scrolling
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 7.3 Write unit tests for projects page components
    - Test ProjectButton renders with correct styling
    - Test projects are sorted alphabetically
    - Test responsive layout at different breakpoints
    - Test hover states work correctly
    - _Requirements: 11.1, 11.2, 5.4_

- [ ] 8. Build about page
  - [x] 8.1 Create about page layout
    - Use same typography and color scheme as other pages
    - Maintain consistent layout and spacing (2rem mobile, 3rem desktop padding)
    - Display personal information about Diego Morales
    - Ensure no emojis are displayed
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 18.5_
  
  - [~] 8.2 Write unit tests for about page
    - Test page renders with correct layout
    - Test typography and spacing consistency
    - Test no emojis are displayed
    - _Requirements: 12.2, 12.3, 12.5_

- [ ] 9. Checkpoint - Verify all pages render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement project detail page layout
  - [~] 10.1 Create project detail page with blog-style layout
    - Use single-column layout with 800px max width
    - Display project title as h1 with page-title font size
    - Add project metadata section (date, status, tags)
    - Apply 2rem vertical spacing between sections
    - Use 2rem (mobile) / 3rem (desktop) horizontal padding
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [~] 10.2 Integrate MDX content rendering
    - Parse MDX files with frontmatter using gray-matter
    - Render MDX body content with proper typography
    - Apply consistent styling to headings, paragraphs, lists
    - Maintain reading-optimized line height (1.6)
    - _Requirements: 13.2, 13.5_
  
  - [~] 10.3 Write unit tests for project detail layout
    - Test project title and metadata render correctly
    - Test MDX content renders with proper styling
    - Test max-width constraint is applied
    - Test spacing between sections
    - _Requirements: 13.1, 13.3, 13.4_

- [ ] 11. Add optional media support to project detail pages
  - [~] 11.1 Create VideoEmbed component for embedded videos
    - Support embedded video URLs with responsive 16:9 aspect ratio
    - Use responsive container that scales to content width
    - Only render when video embedUrl is provided
    - _Requirements: 14.1, 15.1, 15.3, 15.4_
  
  - [~] 11.2 Create VideoLink component for external video links
    - Display video link with descriptive text
    - Open link in new browser tab (target="_blank" rel="noopener noreferrer")
    - Only render when video url is provided (without embedUrl)
    - _Requirements: 14.1, 15.2, 15.5_
  
  - [~] 11.3 Create ImageGallery component
    - Display images at full content width or smaller
    - Add alt text for accessibility
    - Use 1.5rem spacing between consecutive images
    - Support multiple images per project
    - Only render when images array is not empty
    - _Requirements: 14.2, 16.1, 16.2, 16.3, 16.4_
  
  - [~] 11.4 Create DocumentLinks component
    - Display document links with descriptive text and external link icon
    - Open links in new browser tab
    - Support multiple document links per project
    - Only render when documents array is not empty
    - _Requirements: 14.3, 17.1, 17.2, 17.3, 17.4, 17.5_
  
  - [~] 11.5 Integrate media components into project detail page
    - Conditionally render VideoEmbed/VideoLink when videos array has items
    - Conditionally render ImageGallery when images array has items
    - Conditionally render DocumentLinks when documents array has items
    - Do not display placeholders or empty sections for missing media
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [~] 11.6 Write unit tests for media components
    - Test VideoEmbed renders with correct aspect ratio
    - Test VideoLink opens in new tab
    - Test ImageGallery displays multiple images with spacing
    - Test DocumentLinks render with external link icons
    - Test components do not render when data is empty
    - _Requirements: 14.4, 15.3, 16.3, 17.4_

- [ ] 12. Implement responsive behavior across all pages
  - [~] 12.1 Add responsive typography scaling
    - Configure font sizes to scale proportionally across breakpoints
    - Test hero title, page titles, and body text at mobile/tablet/desktop
    - Ensure line heights remain between 1.4 and 1.8
    - _Requirements: 1.3, 1.4, 6.5_
  
  - [~] 12.2 Implement responsive layout breakpoints
    - Mobile (< 640px): Single column, full-width buttons, reduced padding
    - Tablet (640px-1024px): 1-2 columns, medium padding
    - Desktop (> 1024px): 2-3 columns for grids, full padding
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [~] 12.3 Ensure touch targets meet accessibility standards
    - Verify all clickable elements are at least 44x44 pixels on mobile
    - Test ProjectButton, navigation links, and other interactive elements
    - _Requirements: 6.6_
  
  - [~] 12.4 Write responsive behavior tests
    - Test layout changes at each breakpoint
    - Test font scaling across viewports
    - Test touch target sizes on mobile
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6_

- [ ] 13. Add animations and transitions
  - [~] 13.1 Configure transition timing in Tailwind
    - Define transition durations (fast: 150ms, normal: 200ms, slow: 300ms, slower: 600ms)
    - Configure easing functions (ease-in-out, ease-in, ease-out)
    - _Requirements: 7.1, 7.4_
  
  - [~] 13.2 Implement hover transitions on interactive elements
    - Apply color transitions to navigation links (200ms)
    - Apply scale and shadow transitions to ProjectButton (200ms)
    - Apply transitions to all clickable elements
    - _Requirements: 7.1, 7.2, 8.6_
  
  - [~] 13.3 Add page load animations
    - Implement hero section fade-in (600ms)
    - Add stagger fade-in for featured projects (100ms delay between items)
    - _Requirements: 7.3_
  
  - [~] 13.4 Add reduced motion support
    - Implement prefers-reduced-motion media query
    - Disable or minimize animations when user prefers reduced motion
    - _Requirements: 7.5_
  
  - [~] 13.5 Write animation tests
    - Test transition durations are correct
    - Test hover states trigger transitions
    - Test reduced motion preference is respected
    - _Requirements: 7.1, 7.2, 7.5_

- [ ] 14. Implement frontmatter schema validation
  - [~] 14.1 Create Zod schema for project frontmatter
    - Define required fields (title, description, date, status)
    - Define optional fields with defaults (tags, thumbnail, images, videos, links, documents)
    - Validate date format (YYYY-MM-DD)
    - Validate URL formats for links and videos
    - _Requirements: 14.1, 14.2, 14.3, 15.1, 15.2, 16.1, 17.1_
  
  - [~] 14.2 Add validation to project data fetching
    - Validate frontmatter when parsing MDX files
    - Log validation errors to console with file path and missing field
    - Exclude invalid projects from listings
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [~] 14.3 Write validation tests
    - Test valid frontmatter passes validation
    - Test invalid frontmatter is rejected
    - Test optional fields use correct defaults
    - Test date and URL format validation
    - _Requirements: 14.1, 14.2, 14.3_

- [ ] 15. Checkpoint - Verify all features work end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Final polish and accessibility verification
  - [~] 16.1 Verify no emojis policy across all pages
    - Check landing page title and content
    - Check navigation header
    - Check projects page
    - Check about page
    - Check footer
    - Check project detail pages
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 2.4_
  
  - [~] 16.2 Verify color contrast ratios
    - Test all text/background combinations meet WCAG AA (4.5:1 minimum)
    - Test interactive elements have sufficient contrast (3:1 minimum)
    - _Requirements: 3.4_
  
  - [~] 16.3 Verify spacing consistency
    - Check vertical spacing between sections (3rem minimum)
    - Check horizontal padding (1.5rem mobile, 3rem desktop)
    - Check content max-width (1280px general, 800px reading)
    - Check grid gaps (1.5rem minimum)
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  
  - [~] 16.4 Run accessibility audit
    - Run automated accessibility tests (axe-core or similar)
    - Test keyboard navigation
    - Verify semantic HTML structure
    - Test with screen reader (optional manual test)
    - _Requirements: 3.4, 6.6_

- [ ] 17. Final checkpoint - Complete implementation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- All code should be written in TypeScript with proper type definitions
- Use Next.js 14+ App Router conventions throughout
- Tailwind CSS should be used for all styling (no custom CSS files unless necessary)
- Focus on clean, maintainable code that follows Next.js and React best practices
