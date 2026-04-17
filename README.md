# Engineer Portfolio

A modern, static portfolio website built with Next.js 14, showcasing engineering projects with MDX-based content management.

## Features

- MDX-based project content with frontmatter metadata
- Tag-based filtering system
- Image gallery support for project showcases
- Responsive design with Tailwind CSS
- Static site generation for optimal performance
- Comprehensive test suite with property-based testing

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Content**: MDX with gray-matter for frontmatter parsing
- **Testing**: Vitest + React Testing Library + fast-check
- **Type Safety**: TypeScript with Zod validation

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/DiegoRobotics/engineer-portfolio.git
cd engineer-portfolio

# Install dependencies
npm install
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
# Create production build
npm run build

# Preview production build
npm start
```

The static site will be exported to the `out/` directory.

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page with project grid
│   ├── about/             # About page
│   └── projects/[slug]/   # Dynamic project detail pages
├── components/            # React components
├── content/projects/      # MDX project files
├── lib/                   # Utility functions and data fetching
├── public/images/         # Project images
└── config/                # Site configuration
```

## Adding Projects

Create a new `.mdx` file in `content/projects/`:

```mdx
---
title: "Project Name"
description: "Brief description"
date: "2024-01-15"
tags: ["tag1", "tag2"]
featured: true
images: ["/images/project1.jpg"]
---

# Project Details

Your project content here...
```

## License

MIT
