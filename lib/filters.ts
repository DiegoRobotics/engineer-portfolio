import { ProjectMeta } from './projects';

export function filterProjectsByTag(projects: ProjectMeta[], tag: string | null): ProjectMeta[] {
  // When tag is null, return all projects
  if (tag === null) {
    return projects;
  }
  
  // When tag is a specific value, return only projects whose tags array contains that tag
  return projects.filter(project => project.tags.includes(tag));
}
