# Design Document: Portfolio Redesign

## Overview

The portfolio redesign transforms Diego Morales' engineering portfolio into a clean, professional, and elegant web experience optimized for recruiters and technical audiences. The design emphasizes visual hierarchy, readability, and ease of navigation through a three-page architecture: Landing Page, Projects Page, and About Page.

### Design Goals

1. **Professional Aesthetic**: Create a serious, elegant interface without emojis or playful elements
2. **Content Prominence**: Make project titles and content the primary visual focus
3. **Optimal Readability**: Use typography and spacing to enhance content consumption
4. **Responsive Excellence**: Ensure seamless experience across all device sizes
5. **Rich Media Support**: Enable optional videos, images, and document links in project details

### Key Design Principles

- **Clarity over Complexity**: Simple, clean layouts that prioritize content
- **Consistent Visual Language**: Unified typography, color, and spacing systems
- **Progressive Disclosure**: Show essential information first, details on demand
- **Accessibility First**: Maintain WCAG contrast ratios and semantic HTML

## Architecture

### Page Structure

The portfolio consists of three primary pages with a shared layout wrapper:

```
RootLayout (app/layout.tsx)
├── Navigation Header (fixed/sticky)
├── Main Content Area
│   ├── Landing Page (/)
│   │   ├── Hero Title: "Diego Morales' Engineering Projects"
│   │   └── Featured Projects Section (3-6 projects)
│   ├── Projects Page (/projects)
│   │   └── All Projects (alphabetically sorted, large buttons)
│   └── About Page (/about)
│       └── Personal Information
└── Footer (minimal, professional)
```

### Routing Architecture

- **Static Generation**: All pages use Next.js App Router with static generation
- **Dynamic Routes**: Project detail pages use `/projects/[slug]` pattern
- **Metadata**: Each page defines appropriate title and description metadata

### Layout Hierarchy

1. **Root Layout**: Provides global structure (Header, Main, Footer)
2. **Page Layouts**: Each page implements its specific content structure
3. **Component Layouts**: Reusable components (ProjectCard, ProjectButton) maintain internal layout consistency

## Components and Interfaces

### Core Components

#### 1. Navigation Header Component

**Purpose**: Provides global navigation across all pages

**Visual Specifications**:
- Height: 64px (mobile), 72px (desktop)
- Background: Neutral color from palette (e.g., white or light gray)
- Position: Sticky at top of viewport
- Border: 1px bottom border in subtle gray

**Structure**:
```tsx
<header className="sticky top-0 z-50 border-b">
  <nav className="container mx-auto px-6 h-16 lg:h-18">
    <div className="flex items-center justify-between h-full">
      <Logo />
      <NavigationLinks />
    </div>
  </nav>
</header>
```

**Navigation Links**:
- Home, Projects, About
- Active state: Underline decoration (2px, offset 4px)
- Hover state: Color transition (200ms ease)
- Spacing: 1.5rem between links

**Interface**:
```typescript
interface NavigationHeaderProps {
  currentPath?: string;
}
```

#### 2. Project Button Component

**Purpose**: Large, prominent clickable cards for project navigation

**Visual Specifications**:
- Padding: 1.5rem vertical, 2rem horizontal
- Border: 1px solid with subtle shadow
- Border radius: 0.5rem (8px)
- Title font size: 1.5rem (24px) on mobile, 1.875rem (30px) on desktop
- Hover: Scale 1.02, shadow increase, transition 200ms

**Structure**:
```tsx
<Link href={`/projects/${slug}`}>
  <div className="project-button">
    <h3 className="project-title">{title}</h3>
    {showDescription && <p className="project-description">{description}</p>}
  </div>
</Link>
```

**Interface**:
```typescript
interface ProjectButtonProps {
  slug: string;
  title: string;
  description?: string;
  showDescription?: boolean;
}
```

#### 3. Featured Project Card Component

**Purpose**: Display featured projects on landing page

**Visual Specifications**:
- Similar to ProjectButton but with additional metadata
- Includes: thumbnail (optional), title, description, date, status
- Grid layout: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Gap: 1.5rem between cards

**Interface**:
```typescript
interface FeaturedProjectCardProps {
  project: ProjectMeta;
}

interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  status: string;
  tags: string[];
  thumbnail?: string;
}
```

#### 4. Project Detail Layout Component

**Purpose**: Blog-style layout for individual project pages

**Visual Specifications**:
- Max width: 800px (optimal reading width)
- Padding: 2rem horizontal on mobile, 3rem on desktop
- Vertical spacing: 2rem between sections
- Content sections: Title, Metadata, Body, Media Assets

**Structure**:
```tsx
<article className="project-detail">
  <header>
    <h1>{title}</h1>
    <ProjectMetadata date={date} status={status} tags={tags} />
  </header>
  
  <div className="project-body">
    <MDXContent body={body} />
  </div>
  
  {videos && <VideoSection videos={videos} />}
  {images && <ImageGallery images={images} />}
  {documents && <DocumentLinks documents={documents} />}
</article>
```

#### 5. Media Components

**Video Embed Component**:
```typescript
interface VideoEmbedProps {
  url: string;
  title?: string;
}
// Responsive 16:9 aspect ratio container
```

**Image Gallery Component**:
```typescript
interface ImageGalleryProps {
  images: string[];
  alt?: string;
}
// Full-width images with 1.5rem spacing
```

**Document Links Component**:
```typescript
interface DocumentLinksProps {
  documents: Array<{
    label: string;
    file: string;
  }>;
}
// External link icon, opens in new tab
```

#### 6. Footer Component

**Purpose**: Minimal footer with copyright and contact info

**Visual Specifications**:
- Padding: 2rem vertical, 1.5rem horizontal
- Background: Neutral color (matching header)
- Text: Body font size, neutral color
- Alignment: Center or grid layout

**Interface**:
```typescript
interface FooterProps {
  copyrightYear?: number;
  contactEmail?: string;
}
```

### Component Composition

**Landing Page Composition**:
```
LandingPage
├── HeroSection
│   └── Title: "Diego Morales' Engineering Projects"
└── FeaturedProjectsSection
    └── FeaturedProjectCard[] (3-6 items)
```

**Projects Page Composition**:
```
ProjectsPage
└── ProjectButtonList
    └── ProjectButton[] (all projects, alphabetically sorted)
```

**Project Detail Page Composition**:
```
ProjectDetailPage
├── ProjectHeader
├── MDXContent
├── VideoSection (optional)
├── ImageGallery (optional)
└── DocumentLinks (optional)
```

## Data Models

### Frontmatter Schema

The MDX frontmatter schema defines project metadata with optional media fields:

```typescript
import { z } from 'zod';

export const FrontmatterSchema = z.object({
  // Required fields
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    z.date().transform(date => date.toISOString().split('T')[0])
  ]),
  status: z.string().min(1),
  
  // Optional fields with defaults
  tags: z.array(z.string()).optional().default([]),
  thumbnail: z.string().optional(),
  
  // Optional media fields
  images: z.array(z.string()).optional().default([]),
  videos: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
    embedUrl: z.string().url().optional()
  })).optional().default([]),
  links: z.array(z.object({
    label: z.string(),
    url: z.string().url()
  })).optional().default([]),
  documents: z.array(z.object({
    label: z.string(),
    file: z.string()
  })).optional().default([]),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;
```

### Project Data Models

**ProjectMeta** (for cards and lists):
```typescript
interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO 8601 format
  status: string;
  tags: string[];
  thumbnail?: string;
}
```

**ProjectDetail** (for detail pages):
```typescript
interface ProjectDetail extends ProjectMeta {
  images: string[];
  videos: Array<{
    label: string;
    url: string;
    embedUrl?: string;
  }>;
  links: Array<{
    label: string;
    url: string;
  }>;
  documents: Array<{
    label: string;
    file: string;
  }>;
  body: string; // Raw MDX content
}
```

### Typography System Data Model

```typescript
interface TypographySystem {
  fonts: {
    heading: string; // Serif font family
    body: string;    // Sans-serif font family
  };
  sizes: {
    xs: string;   // 0.75rem (12px)
    sm: string;   // 0.875rem (14px)
    base: string; // 1rem (16px)
    lg: string;   // 1.125rem (18px)
    xl: string;   // 1.25rem (20px)
    '2xl': string; // 1.5rem (24px)
    '3xl': string; // 1.875rem (30px)
    '4xl': string; // 2.25rem (36px)
    '5xl': string; // 3rem (48px)
  };
  weights: {
    normal: number;  // 400
    medium: number;  // 500
    semibold: number; // 600
    bold: number;    // 700
  };
  lineHeights: {
    tight: number;   // 1.25
    normal: number;  // 1.5
    relaxed: number; // 1.75
  };
}
```

### Color Scheme Data Model

```typescript
interface ColorScheme {
  neutral: {
    50: string;   // Lightest
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;  // Mid-tone
    600: string;
    700: string;
    800: string;
    900: string;  // Darkest
  };
  accent: {
    light: string;
    DEFAULT: string;
    dark: string;
  };
  background: string;
  foreground: string;
}
```

### Responsive Breakpoints Data Model

```typescript
interface Breakpoints {
  sm: string;  // 640px - Mobile landscape / small tablet
  md: string;  // 768px - Tablet
  lg: string;  // 1024px - Desktop
  xl: string;  // 1280px - Large desktop
  '2xl': string; // 1536px - Extra large desktop
}
```

## Design System Specifications

### Typography System

#### Font Families

**Headings (Serif)**:
- Primary: `'Merriweather', 'Georgia', serif`
- Fallback: System serif fonts
- Usage: Page titles, section headings, project titles

**Body Text (Sans-serif)**:
- Primary: `'Inter', 'system-ui', sans-serif`
- Fallback: System sans-serif fonts
- Usage: Body text, UI elements, navigation, descriptions

#### Font Scale

| Element | Mobile | Desktop | Weight | Line Height |
|---------|--------|---------|--------|-------------|
| Hero Title | 2.25rem (36px) | 3rem (48px) | Bold (700) | 1.2 |
| Page Title | 1.875rem (30px) | 2.25rem (36px) | Bold (700) | 1.3 |
| Section Heading | 1.5rem (24px) | 1.875rem (30px) | Semibold (600) | 1.4 |
| Project Button Title | 1.25rem (20px) | 1.5rem (24px) | Semibold (600) | 1.4 |
| Body Large | 1.125rem (18px) | 1.125rem (18px) | Normal (400) | 1.6 |
| Body | 1rem (16px) | 1rem (16px) | Normal (400) | 1.6 |
| Body Small | 0.875rem (14px) | 0.875rem (14px) | Normal (400) | 1.5 |
| Caption | 0.75rem (12px) | 0.75rem (12px) | Medium (500) | 1.4 |

#### Implementation (Tailwind Config)

```typescript
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      serif: ['Merriweather', 'Georgia', 'serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      'hero': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
      'page-title': ['2.25rem', { lineHeight: '1.3', fontWeight: '700' }],
      'section': ['1.875rem', { lineHeight: '1.4', fontWeight: '600' }],
    },
  },
}
```

### Color Scheme

#### Neutral Palette (Primary)

Based on a sophisticated gray scale with warm undertones:

```typescript
neutral: {
  50: '#fafaf9',   // Off-white background
  100: '#f5f5f4',  // Light background
  200: '#e7e5e4',  // Subtle borders
  300: '#d6d3d1',  // Borders
  400: '#a8a29e',  // Disabled text
  500: '#78716c',  // Secondary text
  600: '#57534e',  // Body text
  700: '#44403c',  // Headings
  800: '#292524',  // Dark headings
  900: '#1c1917',  // Maximum contrast
}
```

#### Accent Color

A subtle, professional accent for interactive elements:

```typescript
accent: {
  light: '#93c5fd',   // Light blue for hover states
  DEFAULT: '#3b82f6', // Primary blue for links and CTAs
  dark: '#1e40af',    // Dark blue for active states
}
```

#### Semantic Colors

```typescript
background: neutral[50],     // Page background
foreground: neutral[900],    // Primary text
muted: neutral[100],         // Card backgrounds
mutedForeground: neutral[600], // Secondary text
border: neutral[200],        // Borders and dividers
```

#### Contrast Ratios

All text/background combinations maintain WCAG AA compliance:
- Large text (18px+): Minimum 3:1 contrast
- Normal text: Minimum 4.5:1 contrast
- Interactive elements: Minimum 3:1 contrast

### Spacing System

#### Vertical Rhythm

All vertical spacing uses multiples of 0.5rem (8px) for consistency:

```typescript
spacing: {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
}
```

#### Layout Spacing Rules

| Context | Mobile | Desktop | Purpose |
|---------|--------|---------|---------|
| Section Padding | 2rem | 3rem | Horizontal page padding |
| Section Margin | 3rem | 4rem | Vertical section spacing |
| Component Gap | 1rem | 1.5rem | Grid/flex gap spacing |
| Content Max Width | 100% | 1280px | Container max width |
| Reading Max Width | 100% | 800px | Optimal reading width |
| Card Padding | 1.5rem | 2rem | Internal card spacing |

### Responsive Breakpoints

```typescript
screens: {
  sm: '640px',   // Mobile landscape / small tablet
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large desktop
}
```

#### Responsive Behavior

**Mobile (< 640px)**:
- Single column layouts
- Full-width project buttons
- Reduced padding (1.5rem)
- Smaller font sizes
- Stacked navigation (if needed)

**Tablet (640px - 1024px)**:
- 1-2 column layouts
- Increased padding (2rem)
- Medium font sizes
- Horizontal navigation

**Desktop (> 1024px)**:
- 2-3 column layouts for grids
- Maximum padding (3rem)
- Full font sizes
- Expanded navigation with spacing

### Animation and Transitions

#### Transition Specifications

```typescript
transitionDuration: {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '600ms',
}

transitionTimingFunction: {
  DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out
  in: 'cubic-bezier(0.4, 0, 1, 1)',        // ease-in
  out: 'cubic-bezier(0, 0, 0.2, 1)',       // ease-out
}
```

#### Animation Patterns

**Hover States** (200ms):
- Links: Color change
- Buttons: Scale 1.02 + shadow increase
- Cards: Border color change + subtle shadow

**Page Load** (600ms):
- Hero section: Fade in from opacity 0 to 1
- Featured projects: Stagger fade-in (100ms delay between items)

**Interactive Feedback** (150ms):
- Button press: Scale 0.98
- Link click: Color change

#### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Component Styling Specifications

#### Project Button Styling

```css
.project-button {
  padding: 1.5rem 2rem;
  border: 1px solid theme('colors.neutral.200');
  border-radius: 0.5rem;
  background: theme('colors.neutral.50');
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 200ms ease;
}

.project-button:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: theme('colors.accent.DEFAULT');
}

.project-button-title {
  font-family: theme('fontFamily.serif');
  font-size: 1.5rem;
  font-weight: 600;
  color: theme('colors.neutral.800');
  line-height: 1.4;
}
```

#### Navigation Link Styling

```css
.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: theme('colors.neutral.600');
  transition: color 200ms ease;
  text-decoration: none;
}

.nav-link:hover {
  color: theme('colors.neutral.900');
}

.nav-link.active {
  color: theme('colors.neutral.900');
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}
```

## Error Handling

### Missing Content Handling

**Missing Projects Directory**:
- `getAllProjects()` returns empty array
- Landing page displays message: "No projects available"
- Projects page displays message: "No projects found"

**Missing Project File**:
- `getProjectBySlug()` returns null
- Project detail page returns 404 Not Found

**Invalid Frontmatter**:
- Validation error logged to console
- Project excluded from listings
- Error format: `[portfolio-redesign] ERROR: Skipping "path/to/file.mdx" — missing required field: "fieldName"`

### Optional Media Handling

**Missing Optional Fields**:
- Videos array empty: Video section not rendered
- Images array empty: Image gallery not rendered
- Documents array empty: Document links section not rendered
- No placeholders or empty states shown

**Invalid Media URLs**:
- Broken image: Display alt text or placeholder
- Invalid video embed: Display error message with link fallback
- Broken document link: Display link with warning icon

### Responsive Layout Fallbacks

**Unsupported Viewport Sizes**:
- Minimum supported width: 320px
- Below 320px: Horizontal scroll enabled
- Above 1536px: Content centered with max-width constraint

**Font Loading Failures**:
- Serif fallback: Georgia, Times New Roman, serif
- Sans-serif fallback: system-ui, -apple-system, sans-serif

### Browser Compatibility

**CSS Feature Detection**:
- Grid layout: Fallback to flexbox
- Custom properties: Fallback to static values
- Backdrop filter: Graceful degradation (no blur effect)

**JavaScript Failures**:
- All pages render with SSG (no JS required for core functionality)
- Interactive features degrade gracefully
- Navigation remains functional without JS

## Testing Strategy

### Unit Testing

**Component Testing** (Vitest + React Testing Library):
- Test each component in isolation
- Verify correct rendering with various props
- Test responsive behavior with viewport mocking
- Test accessibility attributes (ARIA labels, semantic HTML)

**Example Tests**:
```typescript
describe('ProjectButton', () => {
  it('renders project title prominently', () => {
    render(<ProjectButton title="Test Project" slug="test" />);
    expect(screen.getByRole('heading')).toHaveTextContent('Test Project');
  });
  
  it('applies hover styles on mouse enter', () => {
    const { container } = render(<ProjectButton title="Test" slug="test" />);
    const button = container.firstChild;
    fireEvent.mouseEnter(button);
    expect(button).toHaveClass('hover:scale-102');
  });
});
```

**Data Model Testing**:
- Validate frontmatter schema with valid and invalid inputs
- Test optional field defaults
- Test date format validation
- Test URL validation for links

### Visual Regression Testing

**Snapshot Testing**:
- Capture component snapshots at different breakpoints
- Test typography rendering across font stacks
- Verify color contrast ratios
- Test spacing consistency

**Tools**: Storybook + Chromatic or Percy

### Integration Testing

**Page Rendering**:
- Test full page composition with real data
- Verify navigation between pages
- Test dynamic route generation for project details
- Test MDX content rendering

**Responsive Behavior**:
- Test layout changes at each breakpoint
- Verify touch target sizes on mobile
- Test horizontal scrolling prevention
- Test font scaling across viewports

### Accessibility Testing

**Automated Testing** (axe-core):
- Color contrast validation
- Semantic HTML structure
- ARIA attribute correctness
- Keyboard navigation support

**Manual Testing**:
- Screen reader testing (NVDA, VoiceOver)
- Keyboard-only navigation
- Focus indicator visibility
- Reduced motion preference respect

### Performance Testing

**Metrics to Monitor**:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

**Optimization Strategies**:
- Image optimization (Next.js Image component)
- Font subsetting and preloading
- CSS minification and critical CSS extraction
- Static generation for all pages

### Browser and Device Testing

**Target Browsers**:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

**Target Devices**:
- Mobile: iPhone 12/13/14, Samsung Galaxy S21/S22
- Tablet: iPad Air, iPad Pro
- Desktop: 1920x1080, 2560x1440

### Testing Checklist

**Typography**:
- [ ] Serif fonts load correctly for headings
- [ ] Sans-serif fonts load correctly for body text
- [ ] Font sizes scale appropriately across breakpoints
- [ ] Line heights maintain readability (1.4-1.8)
- [ ] Font weights render correctly (regular, medium, bold)

**Color Scheme**:
- [ ] Neutral palette displays consistently
- [ ] Accent colors apply to interactive elements
- [ ] Contrast ratios meet WCAG AA standards
- [ ] Dark text on light backgrounds is readable
- [ ] Border colors are subtle but visible

**Layout and Spacing**:
- [ ] Section spacing is consistent (3rem+ between sections)
- [ ] Horizontal padding scales with viewport
- [ ] Content max-width is enforced (1280px)
- [ ] Reading width is optimal (800px for articles)
- [ ] Grid gaps are consistent (1.5rem)

**Responsive Behavior**:
- [ ] Mobile layout uses single column
- [ ] Tablet layout uses 1-2 columns
- [ ] Desktop layout uses 2-3 columns
- [ ] Touch targets are 44x44px minimum on mobile
- [ ] Navigation adapts to viewport size

**Animations**:
- [ ] Hover transitions complete in 200ms
- [ ] Page load animations complete in 600ms
- [ ] Reduced motion preference is respected
- [ ] Animations use easing functions (not linear)
- [ ] Interactive feedback is immediate (150ms)

**Media Assets**:
- [ ] Videos embed correctly with 16:9 aspect ratio
- [ ] Images display at appropriate sizes
- [ ] Document links open in new tabs
- [ ] Missing media doesn't show placeholders
- [ ] Alt text is present for all images

**Navigation**:
- [ ] Header is sticky at top of viewport
- [ ] Active page is indicated with underline
- [ ] Hover states transition smoothly
- [ ] Links are keyboard accessible
- [ ] No emojis in navigation elements

**Project Display**:
- [ ] Landing page shows 3-6 featured projects
- [ ] Projects page shows all projects alphabetically
- [ ] Project buttons are large and prominent
- [ ] Project titles are the most prominent element
- [ ] Project detail pages use blog-style layout

**No Emoji Policy**:
- [ ] No emojis in page titles
- [ ] No emojis in navigation
- [ ] No emojis in project titles
- [ ] No emojis in footer
- [ ] No emojis anywhere in UI

## Implementation Notes

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS 3+
- **Typography**: Google Fonts (Merriweather, Inter)
- **Content**: MDX with gray-matter for frontmatter
- **Validation**: Zod for schema validation
- **Testing**: Vitest + React Testing Library

### File Structure

```
app/
├── layout.tsx              # Root layout with Header/Footer
├── page.tsx                # Landing page
├── projects/
│   ├── page.tsx            # Projects listing page
│   └── [slug]/
│       └── page.tsx        # Project detail page
└── about/
    └── page.tsx            # About page

components/
├── Header.tsx              # Navigation header
├── Footer.tsx              # Footer
├── ProjectButton.tsx       # Large project button
├── FeaturedProjectCard.tsx # Featured project card
├── ProjectDetail.tsx       # Project detail layout
├── VideoEmbed.tsx          # Video embedding
├── ImageGallery.tsx        # Image display
└── DocumentLinks.tsx       # Document link list

lib/
├── projects.ts             # Project data fetching
└── mdx.ts                  # MDX processing utilities

content/
└── projects/
    └── *.mdx               # Project content files
```

### Configuration Files

**tailwind.config.ts**:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
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
          light: '#93c5fd',
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
      },
      spacing: {
        '18': '4.5rem',
      },
      maxWidth: {
        'reading': '800px',
      },
    },
  },
  plugins: [],
};

export default config;
```

**app/layout.tsx** (Font Loading):
```typescript
import { Merriweather, Inter } from 'next/font/google';

const merriweather = Merriweather({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${merriweather.variable} ${inter.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
```

### Deployment Considerations

**Static Export**:
- All pages can be statically generated
- No server-side runtime required
- Deploy to Vercel, Netlify, or any static host

**Build Optimization**:
- Enable image optimization
- Minify CSS and JavaScript
- Generate static sitemap
- Implement proper caching headers

**SEO**:
- Add metadata to all pages
- Generate Open Graph images
- Implement structured data (JSON-LD)
- Create robots.txt and sitemap.xml

### Future Enhancements

**Potential Additions** (out of scope for this design):
- Dark mode toggle
- Project filtering by tags
- Search functionality
- Project pagination
- RSS feed for projects
- Contact form on About page
- Analytics integration
- Blog section separate from projects

---

**Design Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Ready for Implementation
