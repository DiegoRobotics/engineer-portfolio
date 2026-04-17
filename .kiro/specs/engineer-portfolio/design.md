# Design Document: Engineer Portfolio

## Overview

A statically-generated engineer portfolio website built with **Next.js 14** (App Router, `output: 'export'`), **Tailwind CSS**, and **MDX** files. All content lives in the repository as MDX files; adding or editing a project means editing a file and redeploying. The site is fully pre-rendered at build time and deployable to GitHub Pages or Vercel free tier with zero server dependencies.

### Key Technology Choices

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14 App Router | Static export support, file-based routing, React Server Components |
| Styling | Tailwind CSS | Utility-first, no runtime CSS-in-JS overhead |
| MDX parsing | `gray-matter` + `next-mdx-remote` | `gray-matter` extracts frontmatter; `next-mdx-remote` compiles MDX body for RSC |
| Static export | `output: 'export'` in `next.config.ts` | Produces a self-contained `out/` directory |
| Hosting | GitHub Pages (via GitHub Actions) or Vercel | Both support static file hosting on free tier |
| Property testing | `fast-check` | Mature PBT library for TypeScript |

---

## Architecture

The site follows a **build-time data pipeline** pattern: MDX files on disk are read, parsed, and transformed into typed data structures during `next build`. No runtime file I/O occurs.

```mermaid
flowchart TD
    A[MDX Files\n/content/projects/*.mdx] --> B[MDX Parser\nlib/projects.ts]
    C[Site Config\nconfig/site.ts] --> D[Layout / Pages]
    B --> E{Validation}
    E -- valid --> F[ProjectMeta[]]
    E -- invalid --> G[Build log error\nproject excluded]
    F --> H[Home Page\napp/page.tsx]
    F --> I[Project Detail Pages\napp/projects/[slug]/page.tsx]
    C --> J[About Page\napp/about/page.tsx]
    H --> K[Static Export\nout/]
    I --> K
    J --> K
    K --> L[GitHub Pages / Vercel]
```

### Data Flow at Build Time

1. `lib/projects.ts` reads all `*.mdx` files from `content/projects/` using Node `fs`.
2. `gray-matter` splits each file into `data` (frontmatter) and `content` (MDX body).
3. A Zod schema validates the frontmatter; invalid files are logged and skipped.
4. Valid projects are returned as `ProjectMeta[]` sorted by date descending.
5. `next-mdx-remote/rsc` compiles the MDX body string into a React Server Component tree at page render time.
6. Next.js `generateStaticParams` enumerates all slugs so every detail page is pre-rendered.

---

## Components and Interfaces

### File Structure

```
engineer-portfolio/
├── app/
│   ├── layout.tsx          # Root layout: Header + Footer
│   ├── page.tsx            # Home page: grid + tag filter
│   ├── about/
│   │   └── page.tsx        # About Me page
│   └── projects/
│       └── [slug]/
│           └── page.tsx    # Project detail page
├── components/
│   ├── Header.tsx          # Persistent nav header
│   ├── Footer.tsx          # Persistent footer
│   ├── ProjectCard.tsx     # Card shown in home grid
│   ├── ProjectGrid.tsx     # Responsive grid wrapper
│   ├── TagFilter.tsx       # Client component for tag filtering
│   ├── ImageGallery.tsx    # Scrollable image gallery
│   └── MdxContent.tsx      # Renders compiled MDX body
├── lib/
│   └── projects.ts         # MDX parsing, validation, data access
├── config/
│   └── site.ts             # Global site configuration
├── content/
│   └── projects/
│       └── *.mdx           # One file per project
├── public/
│   └── images/             # Project images and thumbnails
├── next.config.ts
└── tailwind.config.ts
```

### Component Interfaces

```typescript
// ProjectCard
interface ProjectCardProps {
  slug: string;
  title: string;
  thumbnail?: string;
}

// ProjectGrid
interface ProjectGridProps {
  projects: ProjectMeta[];
}

// TagFilter (Client Component)
interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onChange: (tag: string | null) => void;
}

// ImageGallery
interface ImageGalleryProps {
  images: string[];
  alt: string;
}

// MdxContent
interface MdxContentProps {
  source: string; // raw MDX body string
}
```

### lib/projects.ts Public API

```typescript
// Returns all valid projects sorted by date descending
export async function getAllProjects(): Promise<ProjectMeta[]>

// Returns a single project by slug, or null if not found / invalid
export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null>

// Returns the union of all tags across all valid projects (deduplicated)
export async function getAllTags(): Promise<string[]>
```

---

## Data Models

### Frontmatter Schema (Zod)

```typescript
import { z } from 'zod';

export const FrontmatterSchema = z.object({
  title:       z.string().min(1),
  description: z.string().min(1),
  date:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO 8601 date
  status:      z.string().min(1),
  tags:        z.array(z.string()).optional().default([]),
  thumbnail:   z.string().optional(),
  images:      z.array(z.string()).optional().default([]),
  links:       z.array(z.object({ label: z.string(), url: z.string().url() })).optional().default([]),
  documents:   z.array(z.object({ label: z.string(), file: z.string() })).optional().default([]),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;
```

### Derived Types

```typescript
// Minimal data needed to render a ProjectCard
export interface ProjectMeta {
  slug: string;        // derived from filename (without .mdx)
  title: string;
  description: string;
  date: string;        // ISO 8601
  status: string;
  tags: string[];
  thumbnail?: string;
}

// Full data needed to render a ProjectDetailPage
export interface ProjectDetail extends ProjectMeta {
  images: string[];
  links: Array<{ label: string; url: string }>;
  documents: Array<{ label: string; file: string }>;
  body: string;        // raw MDX body string for next-mdx-remote
}
```

### Site Configuration

```typescript
// config/site.ts
export interface SiteConfig {
  title: string;
  engineerName: string;
  bioSummary: string;
  contact?: {
    email?: string;
    github?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
}

export const siteConfig: SiteConfig = {
  title: 'My Portfolio',
  engineerName: 'Your Name',
  bioSummary: 'A short bio...',
  contact: {
    github: 'https://github.com/yourhandle',
  },
};
```

### Slug Derivation

The slug is derived from the MDX filename by stripping the `.mdx` extension:

```
content/projects/my-robot-arm.mdx  →  slug: "my-robot-arm"
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Frontmatter round-trip fidelity

*For any* valid `Frontmatter` object (with all required and optional fields populated), serializing it to a YAML frontmatter string and then parsing it back with `gray-matter` + Zod SHALL produce an object with field values identical to the original.

**Validates: Requirements 1.2, 1.5**

---

### Property 2: Invalid frontmatter is excluded from project list

*For any* MDX file whose frontmatter is missing one or more required fields (`title`, `description`, `date`, `status`), calling `getAllProjects()` SHALL NOT include that file's project in the returned array.

**Validates: Requirements 1.3**

---

### Property 3: MDX body is passed through to project detail

*For any* valid MDX file with a non-empty body string, calling `getProjectBySlug()` SHALL return a `ProjectDetail` whose `body` field is non-empty and matches the original body content.

**Validates: Requirements 1.4**

---

### Property 4: Project list is sorted by date descending

*For any* collection of valid projects with distinct dates, the array returned by `getAllProjects()` SHALL be ordered such that for every adjacent pair `[a, b]`, `a.date >= b.date`.

**Validates: Requirements 2.2**

---

### Property 5: Project card renders title and thumbnail

*For any* `ProjectMeta` object, the rendered `ProjectCard` SHALL contain the project's `title` text and, when a `thumbnail` is defined, an `img` element whose `src` matches the thumbnail path.

**Validates: Requirements 2.3**

---

### Property 6: Project detail page renders all required metadata

*For any* `ProjectDetail` object, the rendered detail page SHALL contain the project's `title`, `description`, `date`, and `status` in its output.

**Validates: Requirements 3.2**

---

### Property 7: Project detail page renders all optional arrays

*For any* `ProjectDetail` object with non-empty `tags`, `links`, and `documents` arrays, the rendered detail page SHALL contain a label element for each tag, an anchor with `target="_blank"` for each link, and a downloadable anchor for each document.

**Validates: Requirements 3.4, 3.5, 3.6**

---

### Property 8: Slug derivation is injective

*For any* two distinct MDX filenames `a.mdx` and `b.mdx` (where `a ≠ b`), their derived slugs SHALL be distinct — i.e., the slug derivation function is injective over valid filenames.

**Validates: Requirements 3.1**

---

### Property 9: Tag filter correctness

*For any* tag `t` (or null) and any collection of projects, the filter function SHALL return exactly the subset of projects whose `tags` array contains `t` when `t` is non-null, and SHALL return all projects when `t` is null.

**Validates: Requirements 4.1, 4.2**

---

### Property 10: Available tags are the deduplicated union

*For any* collection of valid projects, `getAllTags()` SHALL return a list where every tag that appears in at least one project's `tags` array is present exactly once, and no tag appears that is absent from all projects.

**Validates: Requirements 4.4**

---

### Property 11: Contact links render for all provided contact fields

*For any* `SiteConfig` with a non-empty `contact` object, the rendered About page SHALL contain an accessible anchor element for each contact field whose value is a non-empty string.

**Validates: Requirements 5.3**

---

## Error Handling

| Scenario | Behavior |
|---|---|
| MDX file missing required frontmatter field | Log descriptive error (file path + missing field); exclude project from build output; build continues |
| MDX file has malformed YAML frontmatter | `gray-matter` parse error caught; log error with file path; exclude project |
| `config/site.ts` missing or export is undefined | Throw at module load time with descriptive message; build halts |
| Image path in frontmatter does not exist | No build error; browser renders broken image or `<img>` fallback; out of scope for build validation |
| Slug collision (two files produce same slug) | Log warning; second file encountered is excluded |
| `getAllProjects()` called with empty `content/projects/` | Returns empty array; home page renders empty grid with no error |

### Error Logging Format

```
[engineer-portfolio] ERROR: Skipping "content/projects/my-project.mdx" — missing required field: "title"
[engineer-portfolio] ERROR: Skipping "content/projects/bad-yaml.mdx" — frontmatter parse error: <message>
[engineer-portfolio] ERROR: Site config is missing or malformed — halting build.
```

---

## Testing Strategy

### Dual Testing Approach

Unit tests cover specific examples and edge cases. Property-based tests (using [`fast-check`](https://github.com/dubzzz/fast-check)) verify universal correctness properties across randomly generated inputs.

### Property-Based Tests

Each property test runs a minimum of **100 iterations**. Tests are tagged with a comment referencing the design property.

| Test | Property | Library |
|---|---|---|
| Frontmatter round-trip | Property 1 | `fast-check` |
| Invalid files excluded | Property 2 | `fast-check` |
| Date sort order | Property 3 | `fast-check` |
| Tag filter correctness | Property 4 | `fast-check` |
| Tag deduplication | Property 5 | `fast-check` |
| Slug injectivity | Property 6 | `fast-check` |

Tag format for each test:
```
// Feature: engineer-portfolio, Property N: <property_text>
```

### Unit Tests

- `lib/projects.ts`: valid file parsing, slug derivation, empty directory, config error
- `components/ProjectCard`: renders title, renders placeholder when no thumbnail
- `components/TagFilter`: shows all tags, filters correctly on selection, shows "no results" message
- `app/page.tsx`: renders grid, passes correct props to TagFilter
- `app/projects/[slug]/page.tsx`: renders all metadata fields, renders MDX body, renders back-link

### Integration / Smoke Tests

- `next build` completes without error given a valid `content/projects/` directory
- Static export produces `out/index.html`, `out/about/index.html`, and `out/projects/<slug>/index.html` for each valid project
- Lighthouse CI score ≥ 80 on home page (run in CI against the `out/` directory)

### Test Runner

**Vitest** — compatible with Next.js App Router, fast, native TypeScript support.

```bash
# Run all tests once (no watch mode)
npx vitest run
```
