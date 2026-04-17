import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const FrontmatterSchema = z.object({
  title:       z.string().min(1),
  description: z.string().min(1),
  date:        z.union([
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO 8601 date string
    z.date().transform(date => date.toISOString().split('T')[0]) // Convert Date to ISO string
  ]),
  status:      z.string().min(1),
  tags:        z.array(z.string()).optional().default([]),
  thumbnail:   z.string().optional(),
  images:      z.array(z.string()).optional().default([]),
  links:       z.array(z.object({ label: z.string(), url: z.string().url() })).optional().default([]),
  documents:   z.array(z.object({ label: z.string(), file: z.string() })).optional().default([]),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

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

export async function getAllProjects(): Promise<ProjectMeta[]> {
  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  
  // Return empty array if directory doesn't exist
  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const files = fs.readdirSync(projectsDir);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));
  
  // Return empty array if no MDX files
  if (mdxFiles.length === 0) {
    return [];
  }

  const projects: ProjectMeta[] = [];
  const seenSlugs = new Set<string>();

  for (const file of mdxFiles) {
    const filePath = path.join(projectsDir, file);
    const slug = file.replace(/\.mdx$/, '');

    // Check for slug collision
    if (seenSlugs.has(slug)) {
      console.log(`[engineer-portfolio] WARNING: Slug collision detected for "${slug}" — excluding "${file}"`);
      continue;
    }
    seenSlugs.add(slug);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);

      // Validate frontmatter with Zod
      const validationResult = FrontmatterSchema.safeParse(data);
      
      if (!validationResult.success) {
        // Find the first missing required field or log general parse error
        const issues = validationResult.error.issues;
        const missingRequired = issues.find(issue => 
          issue.code === 'invalid_type' && 
          issue.received === 'undefined' &&
          ['title', 'description', 'date', 'status'].includes(issue.path[0] as string)
        );
        
        if (missingRequired) {
          console.log(`[engineer-portfolio] ERROR: Skipping "${path.join('content', 'projects', file)}" — missing required field: "${missingRequired.path[0]}"`);
        } else {
          console.log(`[engineer-portfolio] ERROR: Skipping "${path.join('content', 'projects', file)}" — frontmatter parse error: ${validationResult.error.message}`);
        }
        continue;
      }

      const frontmatter = validationResult.data;

      // Create ProjectMeta object
      const project: ProjectMeta = {
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        date: frontmatter.date,
        status: frontmatter.status,
        tags: frontmatter.tags,
        thumbnail: frontmatter.thumbnail,
      };

      projects.push(project);
    } catch (error) {
      console.log(`[engineer-portfolio] ERROR: Skipping "${path.join('content', 'projects', file)}" — frontmatter parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      continue;
    }
  }

  // Sort by date descending
  projects.sort((a, b) => {
    return b.date.localeCompare(a.date);
  });

  return projects;
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  const filePath = path.join(projectsDir, `${slug}.mdx`);
  
  // Return null if file doesn't exist
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Validate frontmatter with Zod
    const validationResult = FrontmatterSchema.safeParse(data);
    
    if (!validationResult.success) {
      // Log error and return null for invalid frontmatter
      const issues = validationResult.error.issues;
      const missingRequired = issues.find(issue => 
        issue.code === 'invalid_type' && 
        issue.received === 'undefined' &&
        ['title', 'description', 'date', 'status'].includes(issue.path[0] as string)
      );
      
      if (missingRequired) {
        console.log(`[engineer-portfolio] ERROR: Invalid project "${path.join('content', 'projects', `${slug}.mdx`)}" — missing required field: "${missingRequired.path[0]}"`);
      } else {
        console.log(`[engineer-portfolio] ERROR: Invalid project "${path.join('content', 'projects', `${slug}.mdx`)}" — frontmatter parse error: ${validationResult.error.message}`);
      }
      return null;
    }

    const frontmatter = validationResult.data;

    // Create ProjectDetail object
    const project: ProjectDetail = {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      status: frontmatter.status,
      tags: frontmatter.tags,
      thumbnail: frontmatter.thumbnail,
      images: frontmatter.images,
      links: frontmatter.links,
      documents: frontmatter.documents,
      body: content, // raw MDX body string
    };

    return project;
  } catch (error) {
    console.log(`[engineer-portfolio] ERROR: Failed to read project "${path.join('content', 'projects', `${slug}.mdx`)}" — error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

export async function getAllTags(): Promise<string[]> {
  const projects = await getAllProjects();
  
  // Extract all tags from all projects
  const allTags = projects.flatMap(project => project.tags);
  
  // Return deduplicated array of tags
  return [...new Set(allTags)];
}

export function filterProjectsByTag(projects: ProjectMeta[], tag: string | null): ProjectMeta[] {
  // When tag is null, return all projects
  if (tag === null) {
    return projects;
  }
  
  // When tag is a specific value, return only projects whose tags array contains that tag
  return projects.filter(project => project.tags.includes(tag));
}