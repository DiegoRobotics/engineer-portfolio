# Requirements Document

## Introduction

A free, self-hosted engineer portfolio website built with Next.js, Tailwind CSS, and MDX files. The site allows an engineer to showcase projects of any nature (software, physical, simulation, etc.) through a grid of project cards on the home page, with individual detail pages for each project. Content is managed by adding or editing MDX files and redeploying. The site also includes an About Me page. Hosting targets GitHub Pages or Vercel (free tier).

## Glossary

- **Portfolio_Site**: The Next.js web application serving the engineer's portfolio.
- **Project**: A single engineering work item described by an MDX file, containing metadata (frontmatter) and optional rich content.
- **MDX_File**: A Markdown + JSX file stored in the repository that represents one project's content and metadata.
- **Frontmatter**: YAML metadata block at the top of an MDX file containing structured fields such as title, description, tags, date, status, links, images, and documents.
- **Project_Card**: A UI element displayed in the home page grid showing a project's thumbnail image and title.
- **Project_Detail_Page**: A full-page view rendered from an MDX file showing all project metadata and rich content.
- **About_Page**: A dedicated page describing the engineer's background, skills, and contact information.
- **Tag**: A short label attached to a project used for categorization and filtering (e.g., "software", "mechanical", "simulation").
- **Status**: A field indicating the current state of a project (e.g., "In Progress", "Completed", "Archived").
- **Thumbnail**: A representative image displayed on the Project_Card.
- **MDX_Parser**: The component responsible for reading MDX files from the filesystem and extracting frontmatter and content.
- **Static_Site_Generator**: The Next.js build process that pre-renders all pages at build time for static hosting.

---

## Requirements

### Requirement 1: Project Content via MDX Files

**User Story:** As an engineer, I want to define each project in an MDX file, so that I can manage my portfolio content by editing files and redeploying without needing a database or paid CMS.

#### Acceptance Criteria

1. THE MDX_Parser SHALL read all MDX files from a designated `/content/projects` directory at build time.
2. WHEN an MDX file contains a valid frontmatter block, THE MDX_Parser SHALL extract the following fields: `title` (string, required), `description` (string, required), `date` (ISO 8601 date string, required), `status` (string, required), `tags` (array of strings, optional), `thumbnail` (relative image path, optional), `images` (array of relative image paths, optional), `links` (array of objects with `label` and `url` fields, optional), and `documents` (array of objects with `label` and `file` path fields, optional).
3. IF an MDX file is missing a required frontmatter field (`title`, `description`, `date`, or `status`), THEN THE Static_Site_Generator SHALL log a descriptive error identifying the file and missing field, and SHALL exclude that project from the build output.
4. THE MDX_Parser SHALL parse the MDX body content and make it available for rendering as React components on the Project_Detail_Page.
5. FOR ALL valid MDX files, parsing the frontmatter then serializing it back to an equivalent structure SHALL produce an object with identical field values (round-trip property).

---

### Requirement 2: Home Page Project Grid

**User Story:** As a visitor, I want to see all projects displayed in a responsive grid of cards, so that I can quickly browse the engineer's work at a glance.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a home page (`/`) that displays all valid projects as a grid of Project_Cards.
2. WHEN the home page is rendered, THE Portfolio_Site SHALL sort projects by `date` in descending order (most recent first) by default.
3. THE Project_Card SHALL display the project's `thumbnail` image and `title`.
4. WHERE a project has no `thumbnail` defined, THE Project_Card SHALL display a placeholder image or a styled fallback element.
5. THE Portfolio_Site SHALL render the project grid with a responsive layout: 1 column on mobile (viewport width < 640px), 2 columns on tablet (640px–1023px), and 3 columns on desktop (≥ 1024px).
6. WHEN a visitor clicks a Project_Card, THE Portfolio_Site SHALL navigate to that project's Project_Detail_Page.

---

### Requirement 3: Project Detail Page

**User Story:** As a visitor, I want to view a dedicated page for each project, so that I can read the full description, see images, and access relevant links and documents.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL generate a unique Project_Detail_Page for each valid MDX file at the route `/projects/[slug]`, where `slug` is derived from the MDX filename.
2. THE Project_Detail_Page SHALL display the project's `title`, `description`, `date`, and `status`.
3. WHERE a project has one or more `images`, THE Project_Detail_Page SHALL display them in a scrollable image gallery.
4. WHERE a project has one or more `tags`, THE Project_Detail_Page SHALL display each tag as a styled label.
5. WHERE a project has one or more `links`, THE Project_Detail_Page SHALL display each link as a labeled anchor element that opens in a new browser tab.
6. WHERE a project has one or more `documents`, THE Project_Detail_Page SHALL display each document as a labeled downloadable link.
7. THE Project_Detail_Page SHALL render the MDX body content below the metadata section.
8. THE Project_Detail_Page SHALL include a navigation element that returns the visitor to the home page.

---

### Requirement 4: Tag Filtering

**User Story:** As a visitor, I want to filter projects by tag, so that I can find projects relevant to a specific domain (e.g., software, mechanical, simulation).

#### Acceptance Criteria

1. WHEN a visitor selects a tag from the filter UI on the home page, THE Portfolio_Site SHALL display only Project_Cards whose `tags` array contains the selected tag.
2. WHEN no tag filter is active, THE Portfolio_Site SHALL display all Project_Cards.
3. WHEN a visitor selects a tag that matches zero projects, THE Portfolio_Site SHALL display a message indicating no projects match the selected filter.
4. THE Portfolio_Site SHALL derive the list of available filter tags from the union of all `tags` values across all valid projects, with duplicates removed.

---

### Requirement 5: About Me Page

**User Story:** As a visitor, I want to read an About Me page, so that I can learn about the engineer's background, skills, and how to contact them.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render an About Me page at the route `/about`.
2. THE About_Page SHALL display the engineer's name, a bio/description, and a list of skills or areas of expertise.
3. WHERE contact information is provided in the site configuration, THE About_Page SHALL display it as accessible links (e.g., email, GitHub, LinkedIn).
4. THE Portfolio_Site SHALL include a navigation link to the About_Page accessible from the home page.

---

### Requirement 6: Static Site Generation and Free Hosting Compatibility

**User Story:** As an engineer, I want the site to be fully statically generated, so that I can host it for free on GitHub Pages or Vercel without a server.

#### Acceptance Criteria

1. THE Static_Site_Generator SHALL pre-render all pages (home, project detail pages, about) at build time using Next.js static export (`output: 'export'`).
2. THE Portfolio_Site SHALL produce a self-contained static output directory containing only HTML, CSS, JavaScript, and asset files, with no runtime server dependencies.
3. WHEN the static export build completes successfully, THE Portfolio_Site SHALL be deployable to GitHub Pages or Vercel free tier without additional configuration.
4. THE Portfolio_Site SHALL load the home page with a Lighthouse performance score of 80 or above when measured on a standard desktop connection.

---

### Requirement 7: Site Navigation and Layout

**User Story:** As a visitor, I want consistent navigation across all pages, so that I can move between sections of the portfolio easily.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL render a persistent header on all pages containing the site title or logo and navigation links to the home page and the About_Page.
2. THE Portfolio_Site SHALL render a footer on all pages.
3. WHEN a visitor is on the home page, THE Portfolio_Site SHALL visually indicate the active navigation link.
4. WHEN a visitor is on the About_Page, THE Portfolio_Site SHALL visually indicate the active navigation link.

---

### Requirement 8: Site Configuration

**User Story:** As an engineer, I want to configure global site settings (name, bio, social links) in a single file, so that I can update my personal information without modifying multiple pages.

#### Acceptance Criteria

1. THE Portfolio_Site SHALL read global configuration (site title, engineer name, bio summary, and optional social/contact links) from a single configuration file (e.g., `config/site.ts` or `config/site.json`).
2. WHEN the configuration file is updated and the site is rebuilt, THE Portfolio_Site SHALL reflect the updated values on all pages that display them.
3. IF the configuration file is missing or malformed, THEN THE Static_Site_Generator SHALL log a descriptive error and halt the build.
