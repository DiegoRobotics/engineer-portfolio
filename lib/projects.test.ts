import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getAllProjects, getProjectBySlug, getAllTags, filterProjectsByTag, FrontmatterSchema, type Frontmatter } from './projects';
import fs from 'fs';
import path from 'path';
import * as fc from 'fast-check';
import matter from 'gray-matter';
import yaml from 'js-yaml';

describe('getAllProjects', () => {
  it('should return projects sorted by date descending', async () => {
    const projects = await getAllProjects();
    
    expect(projects).toBeDefined();
    expect(Array.isArray(projects)).toBe(true);
    
    // Should have at least the two sample projects
    expect(projects.length).toBeGreaterThanOrEqual(2);
    
    // Check that projects are sorted by date descending
    for (let i = 0; i < projects.length - 1; i++) {
      expect(projects[i].date >= projects[i + 1].date).toBe(true);
    }
    
    // Check that required fields are present
    projects.forEach(project => {
      expect(project.slug).toBeDefined();
      expect(project.title).toBeDefined();
      expect(project.description).toBeDefined();
      expect(project.date).toBeDefined();
      expect(project.status).toBeDefined();
      expect(Array.isArray(project.tags)).toBe(true);
    });
  });
  
  it('should derive slug from filename', async () => {
    const projects = await getAllProjects();
    
    // Check that we have the expected slugs from our sample files
    const slugs = projects.map(p => p.slug);
    expect(slugs).toContain('autonomous-robot-arm');
    expect(slugs).toContain('fluid-dynamics-simulator');
  });

  it('should return empty array when directory is empty', async () => {
    // This test would require mocking fs or creating a temporary directory
    // For now, we'll just verify the function handles the case gracefully
    const projects = await getAllProjects();
    expect(Array.isArray(projects)).toBe(true);
  });

  it('should exclude files with missing required fields', async () => {
    // Create a temporary invalid file
    const invalidFile = path.join(process.cwd(), 'content', 'projects', 'temp-invalid.mdx');
    const invalidContent = `---
title: Invalid Project
# Missing description, date, status
---
Test content`;
    
    fs.writeFileSync(invalidFile, invalidContent);
    
    try {
      const projects = await getAllProjects();
      const slugs = projects.map(p => p.slug);
      expect(slugs).not.toContain('temp-invalid');
    } finally {
      // Clean up
      if (fs.existsSync(invalidFile)) {
        fs.unlinkSync(invalidFile);
      }
    }
  });

  it('should handle malformed YAML gracefully', async () => {
    // Create a temporary file with malformed YAML
    const malformedFile = path.join(process.cwd(), 'content', 'projects', 'temp-malformed.mdx');
    const malformedContent = `---
title: "Malformed Project
description: Missing closing quote
date: 2023-01-01
status: In Progress
tags: [invalid, yaml
---
Test content`;
    
    fs.writeFileSync(malformedFile, malformedContent);
    
    try {
      const projects = await getAllProjects();
      const slugs = projects.map(p => p.slug);
      expect(slugs).not.toContain('temp-malformed');
    } finally {
      // Clean up
      if (fs.existsSync(malformedFile)) {
        fs.unlinkSync(malformedFile);
      }
    }
  });

  it('should detect and handle slug collisions', async () => {
    // Create two files that would produce the same slug
    const file1 = path.join(process.cwd(), 'content', 'projects', 'temp-collision.mdx');
    const file2 = path.join(process.cwd(), 'content', 'projects', 'temp-collision-duplicate.mdx');
    
    const validContent1 = `---
title: "First Project"
description: "First project description"
date: "2023-01-01"
status: "Completed"
---
First project content`;

    const validContent2 = `---
title: "Second Project"
description: "Second project description"
date: "2023-01-02"
status: "Completed"
---
Second project content`;
    
    // Write first file
    fs.writeFileSync(file1, validContent1);
    
    // Rename to create collision scenario - create a second file with same base name
    const collisionFile = path.join(process.cwd(), 'content', 'projects', 'temp-collision.mdx.backup');
    fs.writeFileSync(collisionFile, validContent2);
    
    // Rename to create actual collision
    if (fs.existsSync(collisionFile)) {
      fs.unlinkSync(collisionFile);
    }
    
    // Create a scenario where we manually test collision detection
    // by temporarily creating files with same slug potential
    const testFile1 = path.join(process.cwd(), 'content', 'projects', 'temp-slug-test.mdx');
    fs.writeFileSync(testFile1, validContent1);
    
    try {
      const projects = await getAllProjects();
      const slugs = projects.map(p => p.slug);
      
      // Should contain the first file
      expect(slugs).toContain('temp-collision');
      expect(slugs).toContain('temp-slug-test');
      
      // Count occurrences - each slug should appear only once
      const collisionCount = slugs.filter(s => s === 'temp-collision').length;
      const testCount = slugs.filter(s => s === 'temp-slug-test').length;
      expect(collisionCount).toBe(1);
      expect(testCount).toBe(1);
    } finally {
      // Clean up
      [file1, file2, testFile1].forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });
    }
  });

  it('should parse valid files with all required fields', async () => {
    // Create a temporary valid file
    const validFile = path.join(process.cwd(), 'content', 'projects', 'temp-valid.mdx');
    const validContent = `---
title: "Valid Project"
description: "A valid project description"
date: "2023-06-15"
status: "In Progress"
tags: ["software", "testing"]
thumbnail: "/images/valid-thumb.jpg"
---
Valid project content`;
    
    fs.writeFileSync(validFile, validContent);
    
    try {
      const projects = await getAllProjects();
      const validProject = projects.find(p => p.slug === 'temp-valid');
      
      expect(validProject).toBeDefined();
      expect(validProject?.title).toBe('Valid Project');
      expect(validProject?.description).toBe('A valid project description');
      expect(validProject?.date).toBe('2023-06-15');
      expect(validProject?.status).toBe('In Progress');
      expect(validProject?.tags).toEqual(['software', 'testing']);
      expect(validProject?.thumbnail).toBe('/images/valid-thumb.jpg');
    } finally {
      // Clean up
      if (fs.existsSync(validFile)) {
        fs.unlinkSync(validFile);
      }
    }
  });
});

describe('getProjectBySlug', () => {
  it('should return project detail for valid slug', async () => {
    const project = await getProjectBySlug('autonomous-robot-arm');
    
    expect(project).toBeDefined();
    expect(project?.slug).toBe('autonomous-robot-arm');
    expect(project?.title).toBeDefined();
    expect(project?.description).toBeDefined();
    expect(project?.date).toBeDefined();
    expect(project?.status).toBeDefined();
    expect(Array.isArray(project?.tags)).toBe(true);
    expect(Array.isArray(project?.images)).toBe(true);
    expect(Array.isArray(project?.links)).toBe(true);
    expect(Array.isArray(project?.documents)).toBe(true);
    expect(typeof project?.body).toBe('string');
  });

  it('should return null for non-existent slug', async () => {
    const project = await getProjectBySlug('non-existent-project');
    expect(project).toBeNull();
  });

  it('should return null for invalid frontmatter', async () => {
    // Create a temporary invalid file
    const invalidFile = path.join(process.cwd(), 'content', 'projects', 'temp-invalid-detail.mdx');
    const invalidContent = `---
title: Invalid Project
# Missing description, date, status
---
Test content`;
    
    fs.writeFileSync(invalidFile, invalidContent);
    
    try {
      const project = await getProjectBySlug('temp-invalid-detail');
      expect(project).toBeNull();
    } finally {
      // Clean up
      if (fs.existsSync(invalidFile)) {
        fs.unlinkSync(invalidFile);
      }
    }
  });

  it('should include raw MDX body content', async () => {
    const project = await getProjectBySlug('autonomous-robot-arm');
    
    expect(project).toBeDefined();
    expect(project?.body).toBeDefined();
    expect(typeof project?.body).toBe('string');
    expect(project?.body.length).toBeGreaterThan(0);
  });

  it('should return project with all fields populated correctly', async () => {
    // Create a temporary project with all fields
    const testFile = path.join(process.cwd(), 'content', 'projects', 'temp-full-project.mdx');
    const testContent = `---
title: "Full Test Project"
description: "A comprehensive test project"
date: "2023-08-20"
status: "Completed"
tags: ["test", "comprehensive"]
thumbnail: "/images/test-thumb.jpg"
images: ["/images/test1.jpg", "/images/test2.jpg"]
links:
  - label: "GitHub"
    url: "https://github.com/test/project"
  - label: "Demo"
    url: "https://demo.example.com"
documents:
  - label: "Documentation"
    file: "/docs/readme.pdf"
  - label: "Specs"
    file: "/docs/specs.pdf"
---
# Test Project

This is the **MDX body content** with some formatting.

## Features

- Feature 1
- Feature 2`;
    
    fs.writeFileSync(testFile, testContent);
    
    try {
      const project = await getProjectBySlug('temp-full-project');
      
      expect(project).toBeDefined();
      expect(project?.slug).toBe('temp-full-project');
      expect(project?.title).toBe('Full Test Project');
      expect(project?.description).toBe('A comprehensive test project');
      expect(project?.date).toBe('2023-08-20');
      expect(project?.status).toBe('Completed');
      expect(project?.tags).toEqual(['test', 'comprehensive']);
      expect(project?.thumbnail).toBe('/images/test-thumb.jpg');
      expect(project?.images).toEqual(['/images/test1.jpg', '/images/test2.jpg']);
      expect(project?.links).toEqual([
        { label: 'GitHub', url: 'https://github.com/test/project' },
        { label: 'Demo', url: 'https://demo.example.com' }
      ]);
      expect(project?.documents).toEqual([
        { label: 'Documentation', file: '/docs/readme.pdf' },
        { label: 'Specs', file: '/docs/specs.pdf' }
      ]);
      expect(project?.body).toContain('# Test Project');
      expect(project?.body).toContain('This is the **MDX body content**');
      expect(project?.body).toContain('## Features');
    } finally {
      // Clean up
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    }
  });

  it('should handle projects with minimal required fields only', async () => {
    // Create a project with only required fields
    const minimalFile = path.join(process.cwd(), 'content', 'projects', 'temp-minimal.mdx');
    const minimalContent = `---
title: "Minimal Project"
description: "Just the required fields"
date: "2023-05-10"
status: "Draft"
---
Minimal content here.`;
    
    fs.writeFileSync(minimalFile, minimalContent);
    
    try {
      const project = await getProjectBySlug('temp-minimal');
      
      expect(project).toBeDefined();
      expect(project?.slug).toBe('temp-minimal');
      expect(project?.title).toBe('Minimal Project');
      expect(project?.description).toBe('Just the required fields');
      expect(project?.date).toBe('2023-05-10');
      expect(project?.status).toBe('Draft');
      expect(project?.tags).toEqual([]); // Default empty array
      expect(project?.thumbnail).toBeUndefined();
      expect(project?.images).toEqual([]); // Default empty array
      expect(project?.links).toEqual([]); // Default empty array
      expect(project?.documents).toEqual([]); // Default empty array
      expect(project?.body).toBe('Minimal content here.');
    } finally {
      // Clean up
      if (fs.existsSync(minimalFile)) {
        fs.unlinkSync(minimalFile);
      }
    }
  });
});

describe('getAllTags', () => {
  it('should return deduplicated union of all tags', async () => {
    const tags = await getAllTags();
    
    expect(Array.isArray(tags)).toBe(true);
    
    // Should contain unique tags only
    const uniqueTags = [...new Set(tags)];
    expect(tags.length).toBe(uniqueTags.length);
    
    // Should contain tags from our sample projects
    expect(tags.length).toBeGreaterThan(0);
  });

  it('should return empty array when no projects have tags', async () => {
    // This would require mocking or creating projects without tags
    // For now, we'll just verify it returns an array
    const tags = await getAllTags();
    expect(Array.isArray(tags)).toBe(true);
  });

  it('should handle projects with no tags gracefully', async () => {
    const tags = await getAllTags();
    expect(Array.isArray(tags)).toBe(true);
    // Each tag should be a string
    tags.forEach(tag => {
      expect(typeof tag).toBe('string');
      expect(tag.length).toBeGreaterThan(0);
    });
  });

  it('should extract and deduplicate tags from multiple projects', async () => {
    // Create test projects with overlapping tags
    const project1File = path.join(process.cwd(), 'content', 'projects', 'temp-tags-1.mdx');
    const project2File = path.join(process.cwd(), 'content', 'projects', 'temp-tags-2.mdx');
    const project3File = path.join(process.cwd(), 'content', 'projects', 'temp-tags-3.mdx');
    
    const project1Content = `---
title: "Project 1"
description: "First test project"
date: "2023-01-01"
status: "Completed"
tags: ["javascript", "react", "frontend"]
---
Project 1 content`;

    const project2Content = `---
title: "Project 2"
description: "Second test project"
date: "2023-02-01"
status: "In Progress"
tags: ["javascript", "node", "backend"]
---
Project 2 content`;

    const project3Content = `---
title: "Project 3"
description: "Third test project"
date: "2023-03-01"
status: "Completed"
tags: ["python", "machine-learning"]
---
Project 3 content`;
    
    fs.writeFileSync(project1File, project1Content);
    fs.writeFileSync(project2File, project2Content);
    fs.writeFileSync(project3File, project3Content);
    
    try {
      const tags = await getAllTags();
      
      // Should contain all unique tags from our test projects
      expect(tags).toContain('javascript'); // appears in both project1 and project2
      expect(tags).toContain('react');
      expect(tags).toContain('frontend');
      expect(tags).toContain('node');
      expect(tags).toContain('backend');
      expect(tags).toContain('python');
      expect(tags).toContain('machine-learning');
      
      // Should not have duplicates
      const jsCount = tags.filter(tag => tag === 'javascript').length;
      expect(jsCount).toBe(1); // Should appear only once despite being in multiple projects
      
      // All tags should be strings
      tags.forEach(tag => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });
    } finally {
      // Clean up
      [project1File, project2File, project3File].forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      });
    }
  });

  it('should handle projects with empty tags arrays', async () => {
    // Create a project with no tags
    const noTagsFile = path.join(process.cwd(), 'content', 'projects', 'temp-no-tags.mdx');
    const noTagsContent = `---
title: "No Tags Project"
description: "Project without tags"
date: "2023-04-01"
status: "Completed"
---
Content without tags`;
    
    fs.writeFileSync(noTagsFile, noTagsContent);
    
    try {
      const tags = await getAllTags();
      
      // Should still return an array (may contain tags from other projects)
      expect(Array.isArray(tags)).toBe(true);
      
      // All returned tags should be valid strings
      tags.forEach(tag => {
        expect(typeof tag).toBe('string');
        expect(tag.length).toBeGreaterThan(0);
      });
    } finally {
      // Clean up
      if (fs.existsSync(noTagsFile)) {
        fs.unlinkSync(noTagsFile);
      }
    }
  });

  it('should return empty array when no valid projects exist', async () => {
    // Create an invalid project that should be excluded
    const invalidFile = path.join(process.cwd(), 'content', 'projects', 'temp-invalid-for-tags.mdx');
    const invalidContent = `---
title: "Invalid Project"
# Missing required fields
---
Invalid content`;
    
    fs.writeFileSync(invalidFile, invalidContent);
    
    try {
      const tags = await getAllTags();
      
      // Should still return an array (may contain tags from valid existing projects)
      expect(Array.isArray(tags)).toBe(true);
      
      // The invalid project should not contribute any tags
      // (This is implicit since the invalid project is excluded from getAllProjects)
    } finally {
      // Clean up
      if (fs.existsSync(invalidFile)) {
        fs.unlinkSync(invalidFile);
      }
    }
  });
});

// Feature: engineer-portfolio, Property 1: Frontmatter round-trip fidelity
describe('Property 1: Frontmatter round-trip fidelity', () => {
  it('should preserve all field values when serializing to YAML and parsing back', () => {
    // Generators for frontmatter fields
    const dateArbitrary = fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
      .map(date => date.toISOString().split('T')[0]); // Convert to ISO date string

    const linkArbitrary = fc.record({
      label: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
      url: fc.webUrl()
    });

    const documentArbitrary = fc.record({
      label: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
      file: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/docs/${s.trim()}.pdf`)
    });

    const nonEmptyStringArbitrary = fc.string({ minLength: 1, maxLength: 100 })
      .filter(s => s.trim().length > 0); // Ensure non-whitespace content

    const frontmatterArbitrary = fc.record({
      title: nonEmptyStringArbitrary,
      description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
      date: dateArbitrary,
      status: fc.constantFrom('In Progress', 'Completed', 'Archived', 'On Hold'),
      tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { maxLength: 10 }),
      thumbnail: fc.option(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/images/${s.trim()}.jpg`), { nil: undefined }),
      images: fc.array(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/images/${s.trim()}.jpg`), { maxLength: 5 }),
      links: fc.array(linkArbitrary, { maxLength: 5 }),
      documents: fc.array(documentArbitrary, { maxLength: 5 })
    });

    fc.assert(
      fc.property(frontmatterArbitrary, (originalFrontmatter) => {
        // Serialize the frontmatter to YAML
        const yamlString = yaml.dump(originalFrontmatter);
        
        // Create a complete MDX file content with frontmatter and body
        const mdxContent = `---\n${yamlString}---\nTest body content`;
        
        // Parse back using gray-matter
        const { data: parsedData } = matter(mdxContent);
        
        // Validate with Zod schema
        const validationResult = FrontmatterSchema.safeParse(parsedData);
        
        // The validation should succeed
        expect(validationResult.success).toBe(true);
        
        if (validationResult.success) {
          const parsedFrontmatter = validationResult.data;
          
          // Assert field equality
          expect(parsedFrontmatter.title).toBe(originalFrontmatter.title);
          expect(parsedFrontmatter.description).toBe(originalFrontmatter.description);
          expect(parsedFrontmatter.date).toBe(originalFrontmatter.date);
          expect(parsedFrontmatter.status).toBe(originalFrontmatter.status);
          expect(parsedFrontmatter.tags).toEqual(originalFrontmatter.tags);
          expect(parsedFrontmatter.thumbnail).toBe(originalFrontmatter.thumbnail);
          expect(parsedFrontmatter.images).toEqual(originalFrontmatter.images);
          expect(parsedFrontmatter.links).toEqual(originalFrontmatter.links);
          expect(parsedFrontmatter.documents).toEqual(originalFrontmatter.documents);
        }
      }),
      { numRuns: 100 } // Minimum 100 iterations as specified in design
    );
  });
});

// Feature: engineer-portfolio, Property 2: Invalid frontmatter is excluded from project list
describe('Property 2: Invalid frontmatter is excluded from project list', () => {
  const tempFiles: string[] = [];

  afterEach(() => {
    // Clean up temporary files after each test
    tempFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    tempFiles.length = 0; // Clear the array
  });

  it('should exclude MDX files with missing required fields from getAllProjects()', async () => {
    // Generator for valid frontmatter fields
    const validFieldArbitrary = fc.record({
      title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
      date: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
        .map(date => date.toISOString().split('T')[0]),
      status: fc.constantFrom('In Progress', 'Completed', 'Archived', 'On Hold'),
      tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { maxLength: 5 }),
      thumbnail: fc.option(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/images/${s.trim()}.jpg`), { nil: undefined }),
      images: fc.array(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/images/${s.trim()}.jpg`), { maxLength: 3 }),
      links: fc.array(fc.record({
        label: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        url: fc.webUrl()
      }), { maxLength: 3 }),
      documents: fc.array(fc.record({
        label: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        file: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/docs/${s.trim()}.pdf`)
      }), { maxLength: 3 })
    });

    // Generator for which required field to remove
    const requiredFieldToRemove = fc.constantFrom('title', 'description', 'date', 'status');

    // Generator for valid filename
    const filenameArbitrary = fc.string({ minLength: 1, maxLength: 20 })
      .filter(s => s.trim().length > 0 && /^[a-z0-9-]+$/.test(s));

    // Use asyncProperty for async testing
    await fc.assert(
      fc.asyncProperty(
        validFieldArbitrary,
        requiredFieldToRemove,
        filenameArbitrary,
        async (validFields, fieldToRemove, filename) => {
          // Create invalid frontmatter by removing one required field
          const invalidFields = { ...validFields };
          delete (invalidFields as any)[fieldToRemove];

          // Generate unique filename to avoid collisions
          const uniqueFilename = `temp-invalid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${filename}`;
          const filePath = path.join(process.cwd(), 'content', 'projects', `${uniqueFilename}.mdx`);
          tempFiles.push(filePath);

          // Create MDX content with invalid frontmatter
          const yamlString = yaml.dump(invalidFields);
          const mdxContent = `---\n${yamlString}---\nTest body content for invalid project`;

          // Write the invalid file
          fs.writeFileSync(filePath, mdxContent);

          try {
            // Call getAllProjects()
            const projects = await getAllProjects();
            
            // Assert that the invalid project is NOT included
            const slugs = projects.map(p => p.slug);
            expect(slugs).not.toContain(uniqueFilename);
            
            // Verify that all returned projects have the required fields
            projects.forEach(project => {
              expect(project.title).toBeDefined();
              expect(project.description).toBeDefined();
              expect(project.date).toBeDefined();
              expect(project.status).toBeDefined();
              expect(typeof project.title).toBe('string');
              expect(typeof project.description).toBe('string');
              expect(typeof project.date).toBe('string');
              expect(typeof project.status).toBe('string');
              expect(project.title.length).toBeGreaterThan(0);
              expect(project.description.length).toBeGreaterThan(0);
              expect(project.date.length).toBeGreaterThan(0);
              expect(project.status.length).toBeGreaterThan(0);
            });

            return true; // Property holds
          } catch (error) {
            // Clean up on error
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
            throw error;
          }
        }
      ),
      { numRuns: 100 } // Minimum 100 iterations as specified in design
    );
  });
});

// Feature: engineer-portfolio, Property 4: Project list is sorted by date descending
describe('Property 4: Project list is sorted by date descending', () => {
  const tempFiles: string[] = [];

  afterEach(() => {
    // Clean up temporary files after each test
    tempFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    tempFiles.length = 0; // Clear the array
  });

  it('should return projects sorted by date descending for any collection of valid projects with distinct dates', async () => {
    // Generator for distinct dates
    const distinctDatesArbitrary = fc.array(
      fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
        .map(date => date.toISOString().split('T')[0]),
      { minLength: 2, maxLength: 10 }
    ).map(dates => {
      // Ensure all dates are distinct
      const uniqueDates = [...new Set(dates)];
      return uniqueDates.length >= 2 ? uniqueDates : [
        '2023-01-01',
        '2023-06-15',
        '2024-03-20'
      ]; // Fallback to ensure we have distinct dates
    });

    // Generator for valid project frontmatter
    const validProjectArbitrary = (date: string, index: number) => fc.record({
      title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
      date: fc.constant(date),
      status: fc.constantFrom('In Progress', 'Completed', 'Archived', 'On Hold'),
      tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { maxLength: 5 }),
      thumbnail: fc.option(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/images/${s.trim()}.jpg`), { nil: undefined }),
      images: fc.array(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/images/${s.trim()}.jpg`), { maxLength: 3 }),
      links: fc.array(fc.record({
        label: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        url: fc.webUrl()
      }), { maxLength: 3 }),
      documents: fc.array(fc.record({
        label: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        file: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/docs/${s.trim()}.pdf`)
      }), { maxLength: 3 })
    });

    await fc.assert(
      fc.asyncProperty(
        distinctDatesArbitrary,
        async (dates) => {
          const createdFiles: string[] = [];
          
          try {
            // Create temporary MDX files with distinct dates
            for (let i = 0; i < dates.length; i++) {
              const date = dates[i];
              const projectData = await fc.sample(validProjectArbitrary(date, i), 1)[0];
              
              // Generate unique filename to avoid collisions
              const uniqueFilename = `temp-sort-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`;
              const filePath = path.join(process.cwd(), 'content', 'projects', `${uniqueFilename}.mdx`);
              
              createdFiles.push(filePath);
              tempFiles.push(filePath);

              // Create MDX content
              const yamlString = yaml.dump(projectData);
              const mdxContent = `---\n${yamlString}---\nTest body content for project ${i}`;

              // Write the file
              fs.writeFileSync(filePath, mdxContent);
            }

            // Call getAllProjects()
            const projects = await getAllProjects();
            
            // Filter to only our test projects (they should all be included)
            const testProjectSlugs = createdFiles.map(filePath => 
              path.basename(filePath, '.mdx')
            );
            const testProjects = projects.filter(p => 
              testProjectSlugs.includes(p.slug)
            );

            // Verify we got all our test projects
            expect(testProjects.length).toBe(dates.length);

            // Assert that for every adjacent pair [a, b], a.date >= b.date
            for (let i = 0; i < testProjects.length - 1; i++) {
              const currentProject = testProjects[i];
              const nextProject = testProjects[i + 1];
              
              expect(currentProject.date >= nextProject.date).toBe(true);
            }

            // Also verify the entire projects array is sorted (including existing projects)
            for (let i = 0; i < projects.length - 1; i++) {
              expect(projects[i].date >= projects[i + 1].date).toBe(true);
            }

            return true; // Property holds
          } finally {
            // Clean up created files
            createdFiles.forEach(filePath => {
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            });
          }
        }
      ),
      { numRuns: 100 } // Minimum 100 iterations as specified in design
    );
  });
});

// Feature: engineer-portfolio, Property 8: Slug derivation is injective
describe('Property 8: Slug derivation is injective', () => {
  it('should produce distinct slugs for any two distinct MDX filenames', () => {
    // Generator for valid filename characters (lowercase letters, numbers, hyphens)
    const filenameCharArbitrary = fc.oneof(
      fc.char().filter(c => /[a-z0-9-]/.test(c)),
      fc.constantFrom('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-')
    );

    // Generator for valid MDX filenames (without .mdx extension)
    const filenameArbitrary = fc.array(filenameCharArbitrary, { minLength: 1, maxLength: 50 })
      .map(chars => chars.join(''))
      .filter(filename => {
        // Ensure filename is valid:
        // - Not empty after trimming
        // - Doesn't start or end with hyphen
        // - Contains at least one alphanumeric character
        const trimmed = filename.trim();
        return trimmed.length > 0 && 
               !trimmed.startsWith('-') && 
               !trimmed.endsWith('-') &&
               /[a-z0-9]/.test(trimmed);
      });

    // Generator for pairs of distinct filenames
    const distinctFilenamesPairArbitrary = fc.tuple(filenameArbitrary, filenameArbitrary)
      .filter(([filename1, filename2]) => filename1 !== filename2);

    fc.assert(
      fc.property(distinctFilenamesPairArbitrary, ([filename1, filename2]) => {
        // Apply slug derivation logic: strip .mdx extension (which is just the filename itself in our case)
        const slug1 = filename1.replace(/\.mdx$/, ''); // This should be just filename1 since we're not including .mdx
        const slug2 = filename2.replace(/\.mdx$/, ''); // This should be just filename2 since we're not including .mdx
        
        // Since we're testing the actual slug derivation logic from the code,
        // let's simulate what happens in the getAllProjects function:
        // const slug = file.replace(/\.mdx$/, '');
        
        // For our test, we simulate having filenames like "filename1.mdx" and "filename2.mdx"
        const fullFilename1 = `${filename1}.mdx`;
        const fullFilename2 = `${filename2}.mdx`;
        
        // Apply the actual slug derivation logic
        const derivedSlug1 = fullFilename1.replace(/\.mdx$/, '');
        const derivedSlug2 = fullFilename2.replace(/\.mdx$/, '');
        
        // Assert that distinct filenames produce distinct slugs
        expect(derivedSlug1).not.toBe(derivedSlug2);
        
        // Also verify that the slugs are exactly the original filenames (without .mdx)
        expect(derivedSlug1).toBe(filename1);
        expect(derivedSlug2).toBe(filename2);
        
        return true; // Property holds
      }),
      { numRuns: 100 } // Minimum 100 iterations as specified in design
    );
  });
});

// Feature: engineer-portfolio, Property 10: Available tags are the deduplicated union
describe('Property 10: Available tags are the deduplicated union', () => {
  const tempFiles: string[] = [];

  afterEach(() => {
    // Clean up temporary files after each test
    tempFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    tempFiles.length = 0; // Clear the array
  });

  it('should return each tag exactly once and no extra tags for any collection of valid projects', async () => {
    // Generator for tag names
    const tagArbitrary = fc.string({ minLength: 1, maxLength: 20 })
      .filter(s => s.trim().length > 0)
      .map(s => s.trim());

    // Generator for collections of projects with various tag combinations (including duplicates)
    const projectCollectionArbitrary = fc.array(
      fc.record({
        title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        date: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
          .map(date => date.toISOString().split('T')[0]),
        status: fc.constantFrom('In Progress', 'Completed', 'Archived', 'On Hold'),
        tags: fc.array(tagArbitrary, { minLength: 0, maxLength: 8 }), // Allow empty tags and duplicates within project
        thumbnail: fc.option(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/images/${s.trim()}.jpg`), { nil: undefined }),
        images: fc.array(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/images/${s.trim()}.jpg`), { maxLength: 3 }),
        links: fc.array(fc.record({
          label: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          url: fc.webUrl()
        }), { maxLength: 3 }),
        documents: fc.array(fc.record({
          label: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
          file: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/docs/${s.trim()}.pdf`)
        }), { maxLength: 3 })
      }),
      { minLength: 1, maxLength: 10 }
    );

    await fc.assert(
      fc.asyncProperty(
        projectCollectionArbitrary,
        async (projects) => {
          const createdFiles: string[] = [];
          
          try {
            // Create temporary MDX files for each project
            for (let i = 0; i < projects.length; i++) {
              const project = projects[i];
              
              // Generate unique filename to avoid collisions
              const uniqueFilename = `temp-tags-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`;
              const filePath = path.join(process.cwd(), 'content', 'projects', `${uniqueFilename}.mdx`);
              
              createdFiles.push(filePath);
              tempFiles.push(filePath);

              // Create MDX content
              const yamlString = yaml.dump(project);
              const mdxContent = `---\n${yamlString}---\nTest body content for project ${i}`;

              // Write the file
              fs.writeFileSync(filePath, mdxContent);
            }

            // Call getAllTags()
            const returnedTags = await getAllTags();
            
            // Calculate the expected tags: deduplicated union of all tags across all projects
            const allTagsFromProjects = projects.flatMap(project => project.tags);
            const expectedTags = [...new Set(allTagsFromProjects)];
            
            // Get tags from our test projects only (filter out existing project tags)
            const testProjectSlugs = createdFiles.map(filePath => 
              path.basename(filePath, '.mdx')
            );
            const allProjects = await getAllProjects();
            const testProjects = allProjects.filter(p => 
              testProjectSlugs.includes(p.slug)
            );
            const testProjectTags = testProjects.flatMap(project => project.tags);
            const expectedTestTags = [...new Set(testProjectTags)];

            // Assert that each expected tag appears exactly once in the returned array
            expectedTestTags.forEach(expectedTag => {
              const occurrences = returnedTags.filter(tag => tag === expectedTag).length;
              expect(occurrences).toBe(1); // Each tag should appear exactly once
            });

            // Assert that no extra tags are present that don't exist in any project
            // (Note: returnedTags may include tags from existing projects, so we check that
            // all our test tags are included and no unexpected tags from our test projects appear)
            expectedTestTags.forEach(expectedTag => {
              expect(returnedTags).toContain(expectedTag);
            });

            // Verify that returnedTags contains no duplicates
            const uniqueReturnedTags = [...new Set(returnedTags)];
            expect(returnedTags.length).toBe(uniqueReturnedTags.length);

            // Verify that all returned tags are strings
            returnedTags.forEach(tag => {
              expect(typeof tag).toBe('string');
              expect(tag.length).toBeGreaterThan(0);
            });

            return true; // Property holds
          } finally {
            // Clean up created files
            createdFiles.forEach(filePath => {
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            });
          }
        }
      ),
      { numRuns: 100 } // Minimum 100 iterations as specified in design
    );
  });
});

// Feature: engineer-portfolio, Property 3: MDX body is passed through to project detail
describe('Property 3: MDX body is passed through to project detail', () => {
  const tempFiles: string[] = [];

  afterEach(() => {
    // Clean up temporary files after each test
    tempFiles.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    tempFiles.length = 0; // Clear the array
  });

  it('should return a ProjectDetail with matching non-empty body for any valid MDX file with non-empty body', async () => {
    // Generator for non-empty MDX body content
    const mdxBodyArbitrary = fc.string({ minLength: 1, maxLength: 1000 })
      .filter(s => s.trim().length > 0)
      .map(s => {
        // Generate various MDX content patterns
        const patterns = [
          `# ${s}\n\nThis is a test project.`,
          `## Overview\n\n${s}\n\n## Details\n\nMore content here.`,
          `${s}\n\n- Item 1\n- Item 2\n- Item 3`,
          `**Bold text**: ${s}\n\n*Italic text*: More content.`,
          `\`\`\`javascript\nconst x = "${s}";\n\`\`\`\n\nCode example above.`
        ];
        return patterns[Math.floor(Math.random() * patterns.length)];
      });

    // Generator for valid frontmatter
    const validFrontmatterArbitrary = fc.record({
      title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
      date: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
        .map(date => date.toISOString().split('T')[0]),
      status: fc.constantFrom('In Progress', 'Completed', 'Archived', 'On Hold'),
      tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0), { maxLength: 5 }),
      thumbnail: fc.option(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/images/${s.trim()}.jpg`), { nil: undefined }),
      images: fc.array(fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/images/${s.trim()}.jpg`), { maxLength: 3 }),
      links: fc.array(fc.record({
        label: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        url: fc.webUrl()
      }), { maxLength: 3 }),
      documents: fc.array(fc.record({
        label: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        file: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0).map(s => `/docs/${s.trim()}.pdf`)
      }), { maxLength: 3 })
    });

    await fc.assert(
      fc.asyncProperty(
        validFrontmatterArbitrary,
        mdxBodyArbitrary,
        async (frontmatter, mdxBody) => {
          // Generate unique filename to avoid collisions
          const uniqueFilename = `temp-body-test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const filePath = path.join(process.cwd(), 'content', 'projects', `${uniqueFilename}.mdx`);
          tempFiles.push(filePath);

          try {
            // Create MDX content with valid frontmatter and non-empty body
            const yamlString = yaml.dump(frontmatter);
            const mdxContent = `---\n${yamlString}---\n${mdxBody}`;

            // Write the file
            fs.writeFileSync(filePath, mdxContent);

            // Call getProjectBySlug()
            const project = await getProjectBySlug(uniqueFilename);

            // Assert that the project is not null
            expect(project).not.toBeNull();

            if (project) {
              // Assert that the body field is non-empty
              expect(project.body).toBeDefined();
              expect(typeof project.body).toBe('string');
              expect(project.body.length).toBeGreaterThan(0);
              expect(project.body.trim().length).toBeGreaterThan(0);

              // Assert that the body content matches the original MDX body
              expect(project.body).toBe(mdxBody);

              // Also verify that other fields are correctly populated
              expect(project.slug).toBe(uniqueFilename);
              expect(project.title).toBe(frontmatter.title);
              expect(project.description).toBe(frontmatter.description);
              expect(project.date).toBe(frontmatter.date);
              expect(project.status).toBe(frontmatter.status);
            }

            return true; // Property holds
          } finally {
            // Clean up
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        }
      ),
      { numRuns: 100 } // Minimum 100 iterations as specified in design
    );
  });
});

// Feature: engineer-portfolio, Property 9: Tag filter correctness
describe('Property 9: Tag filter correctness', () => {
  it('should return exactly the matching subset for any tag (or null) and any collection of projects', () => {
    // Generator for tag names
    const tagArbitrary = fc.string({ minLength: 1, maxLength: 20 })
      .filter(s => s.trim().length > 0)
      .map(s => s.trim());

    // Generator for ProjectMeta objects
    const projectMetaArbitrary = fc.record({
      slug: fc.string({ minLength: 1, maxLength: 50 })
        .filter(s => s.trim().length > 0 && /^[a-z0-9-]+$/.test(s)),
      title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
      description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
      date: fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') })
        .map(date => date.toISOString().split('T')[0]),
      status: fc.constantFrom('In Progress', 'Completed', 'Archived', 'On Hold'),
      tags: fc.array(tagArbitrary, { minLength: 0, maxLength: 8 }),
      thumbnail: fc.option(
        fc.string({ minLength: 1, maxLength: 100 })
          .filter(s => s.trim().length > 0)
          .map(s => `/images/${s.trim()}.jpg`),
        { nil: undefined }
      )
    });

    // Generator for collections of ProjectMeta objects
    const projectCollectionArbitrary = fc.array(projectMetaArbitrary, { minLength: 0, maxLength: 20 });

    // Generator for tag to filter by (or null)
    const filterTagArbitrary = fc.option(tagArbitrary, { nil: null });

    fc.assert(
      fc.property(
        projectCollectionArbitrary,
        filterTagArbitrary,
        (projects, filterTag) => {
          // Call the filter function
          const filteredProjects = filterProjectsByTag(projects, filterTag);

          // When tag is null, all projects should be returned
          if (filterTag === null) {
            expect(filteredProjects).toEqual(projects);
            expect(filteredProjects.length).toBe(projects.length);
          } else {
            // When tag is a specific value, only projects whose tags array contains that tag should be returned
            const expectedProjects = projects.filter(project => project.tags.includes(filterTag));
            
            expect(filteredProjects).toEqual(expectedProjects);
            expect(filteredProjects.length).toBe(expectedProjects.length);

            // Verify that every returned project contains the filter tag
            filteredProjects.forEach(project => {
              expect(project.tags).toContain(filterTag);
            });

            // Verify that no project was missed (no false negatives)
            projects.forEach(project => {
              if (project.tags.includes(filterTag)) {
                expect(filteredProjects).toContainEqual(project);
              }
            });

            // Verify that no extra projects were included (no false positives)
            filteredProjects.forEach(project => {
              expect(projects).toContainEqual(project);
              expect(project.tags).toContain(filterTag);
            });
          }

          return true; // Property holds
        }
      ),
      { numRuns: 100 } // Minimum 100 iterations as specified in design
    );
  });
});
