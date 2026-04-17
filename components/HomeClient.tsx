'use client';

import { useState } from 'react';
import { ProjectMeta } from '@/lib/projects';
import { filterProjectsByTag } from '@/lib/filters';
import TagFilter from './TagFilter';
import ProjectGrid from './ProjectGrid';

interface HomeClientProps {
  projects: ProjectMeta[];
  tags: string[];
}

export default function HomeClient({ projects, tags }: HomeClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  const filteredProjects = filterProjectsByTag(projects, activeTag);

  return (
    <div className="space-y-8">
      <TagFilter 
        tags={tags} 
        activeTag={activeTag} 
        onChange={setActiveTag} 
      />
      
      {filteredProjects.length === 0 ? (
        <p className="text-center text-gray-600 py-8">
          No projects match the selected filter
        </p>
      ) : (
        <ProjectGrid projects={filteredProjects} />
      )}
    </div>
  );
}
