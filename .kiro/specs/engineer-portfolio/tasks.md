# Implementation Plan: Engineer Portfolio

## Overview

Build a statically-generated Next.js 14 portfolio site with MDX-based project content, tag filtering, and an About page. Tasks follow the build-time data pipeline: set up the project, implement the data layer, build UI components, wire pages together, and validate with tests.

## Tasks

- [x] 1. Initialize project and configuration
  - Scaffold a new Next.js 14 app with App Router and `output: 'export'` in `next.config.ts`
  - Install dependencies: `tailwindcss`, `gray-matter`, `next-mdx-remote`, `zod`, `fast-check`, `vitest`, `@vitejs/plugin-react`
  - Configure `tailwind.config.ts` with content paths covering `app/`, `components/`
  - Create `config/site.ts` exporting a `siteConfig` object matching the `SiteConfig` interface; throw a descriptive error if the export is undefined
  - Create the `content/projects/` directory with at least two sample `.mdx` files covering all frontmatter fields
  - Create the `public/images/` directory
  - _Requirements: 6.1, 6.2, 8.1, 8.3_

- [x] 2. Implement data models and MDX parsing library
  - [x] 2.1 Define `FrontmatterSchema` (Zod), `ProjectMeta`, and `ProjectDetail` types in `lib/projects.ts`
    - Implement `FrontmatterSchema` with all required and optional fields as specified in the design
    - Derive `Frontmatter`, `ProjectMeta`, and `ProjectDetail` TypeScript types
    - _Requirements: 1.2_

  - [x] 2.2 Implement `getAllProjects()` in `lib/projects.ts`
    - Read all `*.mdx` files from `content/projects/` using Node `fs`
    - Parse each file with `gray-matter`; validate frontmatter with Zod
    - Log descriptive errors for missing required fields or malformed YAML; exclude invalid files
    - Detect slug collisions; log warning and exclude the second file
    - Derive slug from filename (strip `.mdx`)
    - Return `ProjectMeta[]` sorted by `date` descending
    - Return empty array when directory is empty
    - _Requirements: 1.1, 1.3, 2.2_

  - [x] 2.3 Implement `getProjectBySlug()` and `getAllTags()` in `lib/projects.ts`
    - `getProjectBySlug(slug)`: return full `ProjectDetail` (including raw MDX `body`) or `null`
    - `getAllTags()`: return deduplicated union of all tags across valid projects
    - _Requirements: 1.4, 4.4_

  - [x] 2.4 Write property test: frontmatter round-trip fidelity (Property 1)
    - **Property 1: Frontmatter round-trip fidelity**
    - Serialize a generated valid `Frontmatter` object to YAML, parse back with `gray-matter` + Zod, assert field equality
    - **Validates: Requirements 1.2, 1.5**

  - [x] 2.5 Write property test: invalid frontmatter excluded from project list (Property 2)
    - **Property 2: Invalid frontmatter is excluded from project list**
    - Generate MDX files missing one or more required fields; assert `getAllProjects()` does not include them
    - **Validates: Requirements 1.3**

  - [x] 2.6 Write property test: project list sorted by date descending (Property 4)
    - **Property 4: Project list is sorted by date descending**
    - Generate collections of valid projects with distinct dates; assert adjacent pairs satisfy `a.date >= b.date`
    - **Validates: Requirements 2.2**

  - [x] 2.7 Write property test: slug derivation is injective (Property 8)
    - **Property 8: Slug derivation is injective**
    - Generate pairs of distinct filenames; assert their derived slugs are distinct
    - **Validates: Requirements 3.1**

  - [x] 2.8 Write property test: available tags are the deduplicated union (Property 10)
    - **Property 10: Available tags are the deduplicated union**
    - Generate collections of valid projects; assert `getAllTags()` contains each tag exactly once and no extra tags
    - **Validates: Requirements 4.4**

  - [x] 2.9 Write unit tests for `lib/projects.ts`
    - Test valid file parsing, slug derivation, empty directory, config error, and malformed YAML handling
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 3. Checkpoint — Ensure all data layer tests pass
  - Run `npx vitest run` and confirm all tests in `lib/` pass; resolve any failures before continuing.

- [x] 4. Build shared layout and navigation components
  - [x] 4.1 Implement `components/Header.tsx`
    - Render site title/logo and nav links to `/` and `/about`
    - Highlight the active link based on current pathname
    - _Requirements: 7.1, 7.3, 7.4_

  - [x] 4.2 Implement `components/Footer.tsx`
    - Render a minimal footer present on all pages
    - _Requirements: 7.2_

  - [x] 4.3 Create `app/layout.tsx` root layout
    - Wrap all pages with `<Header />` and `<Footer />`
    - Apply global Tailwind base styles
    - _Requirements: 7.1, 7.2_

- [x] 5. Build project card and grid components
  - [x] 5.1 Implement `components/ProjectCard.tsx`
    - Accept `slug`, `title`, `thumbnail` props
    - Render thumbnail image; render a styled placeholder when `thumbnail` is undefined
    - Wrap card in a link navigating to `/projects/[slug]`
    - _Requirements: 2.3, 2.4, 2.6_

  - [x] 5.2 Implement `components/ProjectGrid.tsx`
    - Accept `projects: ProjectMeta[]` prop
    - Render a responsive CSS grid: 1 col mobile, 2 col tablet, 3 col desktop using Tailwind
    - _Requirements: 2.5_

  - [x] 5.3 Write property test: ProjectCard renders title and thumbnail (Property 5)
    - **Property 5: Project card renders title and thumbnail**
    - For any `ProjectMeta`, assert rendered `ProjectCard` contains the title text and, when thumbnail is set, an `img` with matching `src`
    - **Validates: Requirements 2.3**

  - [x] 5.4 Write unit tests for `ProjectCard`
    - Test renders title, renders placeholder when no thumbnail, link points to correct slug
    - _Requirements: 2.3, 2.4, 2.6_

- [x] 6. Build tag filter component
  - [x] 6.1 Implement `components/TagFilter.tsx` (Client Component)
    - Accept `tags`, `activeTag`, `onChange` props
    - Render a button per tag; call `onChange` with the tag or `null` (clear filter)
    - _Requirements: 4.1, 4.2, 4.4_

  - [x] 6.2 Write property test: tag filter correctness (Property 9)
    - **Property 9: Tag filter correctness**
    - For any tag `t` (or null) and any project collection, assert the filter returns exactly the matching subset
    - **Validates: Requirements 4.1, 4.2**

  - [x] 6.3 Write unit tests for `TagFilter`
    - Test shows all tags, filters correctly on selection, clears filter on re-click
    - _Requirements: 4.1, 4.2, 4.4_

- [x] 7. Build home page
  - Implement `app/page.tsx` as a Server Component
  - Call `getAllProjects()` and `getAllTags()` at build time
  - Render `<TagFilter />` and `<ProjectGrid />` with client-side filtering logic
  - Display "No projects match the selected filter" message when filtered list is empty
  - _Requirements: 2.1, 2.2, 4.1, 4.2, 4.3_

  - [x] 7.1 Write unit tests for home page
    - Test renders grid, passes correct props to TagFilter, shows empty-state message
    - _Requirements: 2.1, 4.3_

- [x] 8. Build project detail page
  - [x] 8.1 Implement `components/MdxContent.tsx`
    - Accept `source: string` (raw MDX body)
    - Compile and render using `next-mdx-remote/rsc`
    - _Requirements: 1.4, 3.7_

  - [x] 8.2 Implement `components/ImageGallery.tsx`
    - Accept `images: string[]` and `alt: string` props
    - Render a horizontally scrollable gallery
    - _Requirements: 3.3_

  - [x] 8.3 Implement `app/projects/[slug]/page.tsx`
    - Export `generateStaticParams()` using `getAllProjects()`
    - Call `getProjectBySlug(slug)`; return 404 if null
    - Render title, description, date, status, tags, links, documents, image gallery, MDX body, and back-link to `/`
    - Links open in a new tab (`target="_blank"`); documents render as downloadable anchors
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [x] 8.4 Write property test: project detail page renders all required metadata (Property 6)
    - **Property 6: Project detail page renders all required metadata**
    - For any `ProjectDetail`, assert rendered page contains title, description, date, and status
    - **Validates: Requirements 3.2**

  - [x] 8.5 Write property test: project detail page renders all optional arrays (Property 7)
    - **Property 7: Project detail page renders all optional arrays**
    - For any `ProjectDetail` with non-empty tags, links, and documents, assert correct label/anchor elements are rendered
    - **Validates: Requirements 3.4, 3.5, 3.6**

  - [x] 8.6 Write property test: MDX body passed through to project detail (Property 3)
    - **Property 3: MDX body is passed through to project detail**
    - For any valid MDX file with non-empty body, assert `getProjectBySlug()` returns a `ProjectDetail` with a matching non-empty `body`
    - **Validates: Requirements 1.4**

  - [x] 8.7 Write unit tests for project detail page
    - Test renders all metadata fields, renders MDX body, renders back-link
    - _Requirements: 3.2, 3.7, 3.8_

- [x] 9. Build About page
  - Implement `app/about/page.tsx` as a Server Component
  - Read `siteConfig` and render engineer name, bio, skills/expertise section
  - Render an accessible anchor for each non-empty contact field
  - _Requirements: 5.1, 5.2, 5.3_

  - [x] 9.1 Write property test: contact links render for all provided contact fields (Property 11)
    - **Property 11: Contact links render for all provided contact fields**
    - For any `SiteConfig` with a non-empty `contact` object, assert an accessible anchor exists for each non-empty contact field
    - **Validates: Requirements 5.3**

  - [x] 9.2 Write unit tests for About page
    - Test renders name, bio, and contact links
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 10. Checkpoint — Ensure all component and page tests pass
  - Run `npx vitest run` and confirm all tests pass; resolve any failures before continuing.

- [x] 11. Wire navigation and verify static export
  - Confirm `app/layout.tsx` includes the nav link to `/about` accessible from all pages
  - Run `next build` locally and verify `out/` contains `index.html`, `about/index.html`, and `projects/<slug>/index.html` for each valid project
  - Fix any build errors surfaced by the static export
  - _Requirements: 5.4, 6.1, 6.2, 6.3, 7.1_

- [x] 12. Final checkpoint — Full build and test suite green
  - Run `npx vitest run` — all tests must pass
  - Run `next build` — build must complete without errors
  - Ensure all tests pass; ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with a minimum of 100 iterations per property
- Tag each property test with: `// Feature: engineer-portfolio, Property N: <property_text>`
- Unit tests and property tests are complementary — both should be present for full coverage
- Checkpoints at tasks 3, 10, and 12 ensure incremental validation
